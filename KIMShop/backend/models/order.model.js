import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  stripeSessionId: { type: String, unique: true, sparse: true }, // ✅ Ensures uniqueness but allows `null`
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  paymentMethod: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
