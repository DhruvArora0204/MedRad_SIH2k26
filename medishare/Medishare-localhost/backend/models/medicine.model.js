import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    expirationDate: { type: Date },
    donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    
});
  
export const Medicine = mongoose.model("Medicine", medicineSchema);
  