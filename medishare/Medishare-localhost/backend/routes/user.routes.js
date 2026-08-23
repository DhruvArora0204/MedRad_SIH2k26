import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  uploadMedicalReport,
} from "../controllers/user.controllers.js";
import {
  authMiddleware,
  verifyAdmin,
} from "../middlewares/auth.middlewares.js";
import {
  multerErrorHandler,
  upload,
} from "../middlewares/multer.middleware.js";
import { analyzePdfWithGemini } from "../lib/geminiConfig/gemini.config.js";
import { Donation } from "../models/donation.model.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/profile", authMiddleware, getUserProfile); 

router.post("/upload", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("File is now being sent to Gemini from routes");
    const result = await analyzePdfWithGemini(req.file.path);
    res.json({ message: "Analysis complete", result });
  } catch (error) {
    console.error("Error during file upload and processing:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// --- UPDATED DONATION ROUTE (FIXED) ---
router.post("/donation/", authMiddleware, async (req, res) => {
  try {
    // 1. ADD expiryDate and brand here
    const { medicineName, batchNumber, quantity, manufacturerDetails, expiryDate, brand } = req.body;

    if (!medicineName || !batchNumber || !quantity || !manufacturerDetails) { 
      return res
        .status(400)
        .json({ error: "All fields (medicineName, batchNumber, quantity, manufacturer details) are required" });
    }
    
    console.log("Donation received:", req.body);

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive number" });
    }

    const newDonation = new Donation({
      user: req.user.id,
      medicine: medicineName,
      batchNumber,
      quantity,
      manufacturerDetails,
      expiryDate, // 2. SAVE expiryDate
      brand       // 3. SAVE brand
    });

    await newDonation.save();
    res.status(201).json({
      message: "Donation submitted successfully!",
      donation: newDonation,
    });
  } catch (error) {
    console.error("Donation Error:", error);
    res.status(500).json({ error: error.message });
  }
});
// --------------------------------------

router.patch("/donation/:id", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Allowed values: 'approved', 'rejected'" });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    donation.status = status;
    donation.adminResponse = adminResponse || "";
    await donation.save();

    res.json({ message: `Donation ${status} successfully!`, donation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/donation/", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    console.log("donation api to get all donations called ")
    const donations = await Donation.find().populate("user", "name email");
    console.log(donations)
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/donation/user/:userId", authMiddleware, async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userDonations = await Donation.find({ user: req.params.userId });
    res.json(userDonations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;