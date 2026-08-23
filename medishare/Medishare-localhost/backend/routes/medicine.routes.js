import express from "express";
import { Medicine } from "../models/medicine.model.js";

const router = express.Router();

// Add or Register Medicine (Public & Admin)
router.post("/medicine", async (req, res) => {
    try {
        const { name, price, quantity, expirationDate, batchNumber, brand, manufacturerDetails, manufacturer } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Medicine name is required." });
        }
        
        const existingMedicine = await Medicine.findOne(batchNumber ? { batchNumber } : { name, price });
        if (existingMedicine) {
            existingMedicine.quantity = (existingMedicine.quantity || 0) + (Number(quantity) || 10);
            if (brand) existingMedicine.brand = brand;
            if (expirationDate) existingMedicine.expirationDate = new Date(expirationDate);
            if (manufacturerDetails) existingMedicine.manufacturerDetails = manufacturerDetails;
            if (manufacturer) existingMedicine.manufacturer = manufacturer;
            existingMedicine.isVerified = true;
            await existingMedicine.save();
            return res.status(200).json(existingMedicine);
        }
        
        const medicine = new Medicine({
            name,
            brand: brand || "Generic Pharma",
            batchNumber: batchNumber || `BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
            price: Number(price) || 0,
            quantity: Number(quantity) || 50,
            expirationDate: expirationDate ? new Date(expirationDate) : new Date(Date.now() + 365*24*60*60*1000),
            manufacturerDetails: manufacturerDetails || "Standard Quality Facility",
            manufacturer: manufacturer || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            isVerified: true
        });

        await medicine.save();
        res.status(201).json(medicine);
    } catch (error) {
        console.error("Add medicine error:", error);
        res.status(400).json({ error: error.message });
    }
});

// Get all medicines (Public)
router.get("/medicine", async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });
        res.json(medicines);
    } catch (error) {
        console.error("Get medicines error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get medicine by ID
router.get("/medicine/:id", async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/ecommerce/medicine/:id", async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update medicine
router.put("/medicine/:id", async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!medicine) return res.status(404).json({ message: "Medicine not found" });
        res.json(medicine);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete medicine
router.delete("/medicine/:id", async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) return res.status(404).json({ message: "Medicine not found" });
        res.json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
