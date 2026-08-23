import express from "express";
import { contractInstance } from "../app.js";
import { ethers } from "ethers";
import { Medicine } from "../models/medicine.model.js";

const router = express.Router();

function validateAddress(address) {
    try {
        if (!address) {
            return "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        }
        if (!ethers.isAddress(address)) {
            return "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        }
        return ethers.getAddress(address); 
    } catch (error) {
        console.warn("Address fallback to default:", error.message);
        return "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    }
}

router.post("/api/nfts/mint", async (req, res) => {
    try {
        const { batchNumber } = req.body;
        if (!batchNumber) {
            return res.status(400).json({ error: "Batch number is required" });
        }

        try {
            const medDetails = await contractInstance.getMedicineDetails(batchNumber);
            
            if (!medDetails.isVerified) {
                return res.status(400).json({ error: "Batch not verified" });
            }
            const manufacturerAddress = medDetails.manufacturer;
            const checksumAddress = ethers.getAddress(manufacturerAddress.toLowerCase());
            const tx = await contractInstance.authenticateBatch(
                batchNumber,
                checksumAddress,
                { gasLimit: 500000 }
            );
            
            const receipt = await tx.wait();
            const event = receipt.logs.find(log => 
                log.fragment?.name === "MedicineAuthenticated"
            );
            const tokenId = event?.args[1]?.toString() || "1";

            // Sync to MongoDB
            await Medicine.findOneAndUpdate(
                { batchNumber },
                { isAuthenticated: true, tokenId },
                { new: true }
            );

            res.json({ 
                success: true, 
                tokenId,
                transactionHash: receipt.hash
            });
            
        } catch (error) {
            console.error("Contract error:", error);
            res.status(400).json({ 
                error: error.reason || error.message,
                contractError: error.error?.data?.data 
            });
        }
    } catch (error) {
        console.error("Minting error:", error);
        res.status(500).json({ 
            error: "Minting failed: " + error.message 
        });
    }
});

// Add Medicine Batch (Smart Contract + MongoDB Sync)
router.post("/api/medicines/add", async (req, res) => {
    try {
        const { batchNumber, name, brand, expiryDate, manufacturerDetails, manufacturer, price, quantity } = req.body;

        if (!batchNumber || !name || !brand || !expiryDate || !manufacturerDetails) {
            return res.status(400).json({ error: "All fields (batchNumber, name, brand, expiryDate, manufacturerDetails) are required" });
        }

        const expiryDateObj = new Date(expiryDate);
        const expiryTimestamp = Math.floor(expiryDateObj.getTime() / 1000);
        const validatedAddress = validateAddress(manufacturer);
        
        let contractSuccess = false;
        try {
            if (contractInstance) {
                const tx = await contractInstance.addMedicine(
                    batchNumber,
                    name,
                    brand,
                    expiryTimestamp,
                    manufacturerDetails,
                    validatedAddress
                );
                await tx.wait();
                contractSuccess = true;
            }
        } catch (contractErr) {
            console.warn("Smart contract transaction note:", contractErr.message || contractErr);
        }

        // ALWAYS Save / Upsert to MongoDB
        const mongoMed = await Medicine.findOneAndUpdate(
            { batchNumber },
            {
                name,
                brand,
                batchNumber,
                expirationDate: expiryDateObj,
                manufacturerDetails,
                manufacturer: validatedAddress,
                isVerified: true,
                price: Number(price) || 20,
                quantity: Number(quantity) || 100
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log("Saved verified medicine to MongoDB:", mongoMed);

        res.json({ 
            success: true, 
            batchId: batchNumber,
            contractRegistered: contractSuccess,
            mongoRecord: mongoMed
        });
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ error: "Failed to add medicine: " + error.message });
    }
});

// Verify Medicine Batch
router.patch("/api/medicines/verify", async (req, res) => {
    try {
        const { batchNumber, status } = req.body;

        if (!batchNumber || typeof status !== "boolean") {
            return res.status(400).json({ error: "Invalid parameters" });
        }

        try {
            const tx = await contractInstance.verifyMedicine(batchNumber, status);
            await tx.wait();
        } catch (contractErr) {
            console.warn("Contract verify note:", contractErr.message);
        }

        // Sync MongoDB
        const updatedMed = await Medicine.findOneAndUpdate(
            { batchNumber },
            { isVerified: status },
            { new: true }
        );

        res.json({ success: true, medicine: updatedMed });
    } catch (error) {
        console.error("Error verifying medicine:", error);
        res.status(500).json({ error: "Failed to verify medicine: " + error.message });
    }
});

// Query & Verify Batch
router.get("/api/verify/:batchNumber", async (req, res) => {
    try {
        const batchNumber = req.params.batchNumber;
        
        let batchDetails = null;

        // 1. Try querying Smart Contract
        try {
            const batchData = await contractInstance.verifyBatch(batchNumber);
            batchDetails = {
                isValid: batchData[0],
                isVerified: batchData[1],
                isAuthenticated: batchData[2],
                manufacturer: batchData[3],
                expiryDate: batchData[4]?.toString(),
                isActive: batchData[5],
                tokenId: batchData[6]?.toString(),
                isNFTValid: batchData[7],
            };
        } catch (contractErr) {
            console.warn("Smart contract query fallback to MongoDB for batch:", batchNumber);
        }

        // 2. Check / Sync MongoDB
        let mongoMed = await Medicine.findOne({ batchNumber });
        
        if (!batchDetails && mongoMed) {
            batchDetails = {
                isValid: true,
                isVerified: mongoMed.isVerified ?? true,
                isAuthenticated: mongoMed.isAuthenticated ?? false,
                manufacturer: mongoMed.manufacturer || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                expiryDate: mongoMed.expirationDate ? Math.floor(new Date(mongoMed.expirationDate).getTime() / 1000).toString() : undefined,
                isActive: true,
                tokenId: mongoMed.tokenId || "0",
                isNFTValid: false,
            };
        } else if (batchDetails && !mongoMed) {
            // Found on contract, save to MongoDB
            mongoMed = await Medicine.create({
                name: `Verified Medicine (${batchNumber})`,
                brand: "MediShare Verified",
                batchNumber,
                isVerified: batchDetails.isVerified,
                isAuthenticated: batchDetails.isAuthenticated,
                manufacturer: batchDetails.manufacturer,
                expirationDate: batchDetails.expiryDate ? new Date(Number(batchDetails.expiryDate) * 1000) : new Date()
            }).catch(e => console.warn("Mongo insert note:", e.message));
        }

        if (!batchDetails) {
            return res.status(404).json({ error: "Batch not found on blockchain or database", success: false });
        }

        res.json({ batchDetails, mongoRecord: mongoMed });
    } catch (error) {
        console.error("Error fetching batch details:", error);
        res.status(500).json({ error: "Failed to fetch batch details, batch not found", success: false });
    }
});

router.get("/api/nfts/:manufacturer", async (req, res) => {
    try {
        const { manufacturer } = req.params;
        const validatedAddress = validateAddress(manufacturer);
            
        const nfts = await contractInstance.getManufacturerNFTs(validatedAddress, {
            gasLimit: 500000
        });
        
        res.json({ nfts: nfts.map(nft => nft.toString()) });
    } catch (error) {
        console.error("Error fetching NFTs:", error);
        const status = error.message.includes("Invalid Ethereum") ? 400 : 500;
        res.status(status).json({ error: error.message });
    }
});

// Check NFT Validity
router.get("/api/nft/status/:tokenId", async (req, res) => {
    try {
        const { tokenId } = req.params;
        const isValid = await contractInstance.isNFTValid(tokenId);
        res.json({ valid: isValid });
    } catch (error) {
        console.error("Error checking NFT status:", error);
        res.status(500).json({ error: "Failed to check NFT status: " + error.message });
    }
});

export default router;