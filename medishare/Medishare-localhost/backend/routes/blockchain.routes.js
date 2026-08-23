import express from "express";
import { contractInstance } from "../app.js";
import { ethers } from "ethers";

const router = express.Router();

function validateAddress(address) {
    try {
        console.log("Validating address:", address);
        if (!ethers.isAddress(address)) {
            throw new Error("Invalid Ethereum address format");
        }
        return ethers.getAddress(address); 
    } catch (error) {
        console.error("Address validation failed:", error);
        throw error;
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
            const tokenId = event.args[1].toString();

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

function safeAddress(address) {
    console.log("this is the address we are getting ",address)
    if (typeof address === 'string' && address.startsWith('0x')) {
        let newAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
        return newAddress;
    }
    
    // If it's not a valid address, throw an error
    throw new Error("Invalid Ethereum address format");
}

router.post("/api/medicines/add", async (req, res) => {
    try {
        const { batchNumber, name, brand, expiryDate, manufacturerDetails, manufacturer } = req.body;

        if (!batchNumber || !name || !brand || !expiryDate || !manufacturerDetails || !manufacturer) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);
        const validatedAddress = validateAddress(manufacturer);
        
        const tx = await contractInstance.addMedicine(
            batchNumber,
            name,
            brand,
            expiryTimestamp,
            manufacturerDetails,
            validatedAddress
        );

        await tx.wait();
        res.json({ success: true, batchId: batchNumber });
    } catch (error) {
        console.error("Error adding medicine:", error);
        res.status(500).json({ error: "Failed to add medicine: " + error.message });
    }
});
router.patch("/api/medicines/verify", async (req, res) => {
    try {
        const { batchNumber, status } = req.body;

        if (!batchNumber || typeof status !== "boolean") {
            return res.status(400).json({ error: "Invalid parameters" });
        }

        const tx = await contractInstance.verifyMedicine(batchNumber, status);
        await tx.wait();

        res.json({ success: true });
    } catch (error) {
        console.error("Error verifying medicine:", error);
        res.status(500).json({ error: "Failed to verify medicine: " + error.message });
    }
});

router.get("/api/verify/:batchNumber", async (req, res) => {
    try {
        const batchNumber = req.params.batchNumber;
        const batchData = await contractInstance.verifyBatch(batchNumber);
        const formattedResponse = {
            batchDetails: {
                isValid: batchData[0],
                isVerified: batchData[1],
                isAuthenticated: batchData[2],
                manufacturer: batchData[3],
                expiryDate: batchData[4]?.toString(),
                isActive: batchData[5],
                tokenId: batchData[6]?.toString(),
                isNFTValid: batchData[7],
            },
        };
        res.json(formattedResponse);
    } catch (error) {
        console.error("Error fetching batch details: batch not found ", error);
        res.status(500).json({ error: "Failed to fetch batch details, batch not found", success: "false" });
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