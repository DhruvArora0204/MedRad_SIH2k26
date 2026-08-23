import express from "express";
import { Medicine } from "../models/medicine.model.js";
import { authMiddleware, verifyAdmin } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/medicine", authMiddleware, verifyAdmin, async (req, res) => {
    try {
        const { name, price, quantity, expirationDate } = req.body;
        if (!name || !price || !quantity) {
            return res.status(400).json({ error: "Name, price, and quantity are required fields." });
        }
        
        const existingMedicine = await Medicine.findOne({ name, price });
        if (existingMedicine) {
            existingMedicine.quantity += quantity;
            await existingMedicine.save();
            return res.status(200).json(existingMedicine);
        }
        
        const medicine = new Medicine(req.body);
        await medicine.save();
        res.status(201).json(medicine);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/medicine", authMiddleware, async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/ecommerce/medicine/:id", authMiddleware, async (req, res) => {
    console.log("✅ GET medicine by ID route hit!");
    console.log("Received ID:", req.params.id);
    
    try {
        const medicine = await Medicine.findById(req.params.id);
        console.log("Medicine found:", medicine);
        
        if (!medicine) {
            console.log("❌ Medicine not found!");
            return res.status(404).json({ message: "Medicine not found" });
        }
        
        res.json(medicine);
    } catch (error) {
        console.error("🚨 Error fetching medicine:", error);
        res.status(500).json({ error: error.message });
    }
});

router.put("/medicine/:id", authMiddleware, verifyAdmin, async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        if (!name || !price || !quantity) {
            return res.status(400).json({ error: "Name, price, and quantity are required fields." });
        }
        
        const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!medicine) return res.status(404).json({ message: "Medicine not found" });
        res.json(medicine);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/medicine/:id", authMiddleware, verifyAdmin, async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) return res.status(404).json({ message: "Medicine not found" });
        res.json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
