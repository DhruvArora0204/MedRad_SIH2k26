import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    medicine: { type: String, required: true }, 
    quantity: { type: Number, required: true },
    image: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminResponse: { type: String },
    createdAt: { type: Date, default: Date.now },
    batchNumber : { type : String , required:true},
    manufacturerDetails : {type: String},
    // --- ADD THESE TWO LINES ---
    expiryDate: { type: String }, 
    brand: { type: String }
});

export const Donation = mongoose.model('Donation', donationSchema);