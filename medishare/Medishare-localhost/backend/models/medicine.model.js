import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, default: "Generic Pharma" },
    batchNumber: { type: String, index: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 100 },
    expirationDate: { type: Date },
    manufacturerDetails: { type: String },
    manufacturer: { type: String },
    isVerified: { type: Boolean, default: false },
    isAuthenticated: { type: Boolean, default: false },
    tokenId: { type: String },
    donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    createdAt: { type: Date, default: Date.now }
});

export const Medicine = mongoose.model("Medicine", medicineSchema);