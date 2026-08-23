import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  medicines: [
    {
      medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
      quantity: { type: Number, required: true },
      donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    },
  ],
  totalAmount: { type: Number, required: true },
  stripeSessionId: {
    type: String,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
});
export const Order = mongoose.model("Order", orderSchema);
