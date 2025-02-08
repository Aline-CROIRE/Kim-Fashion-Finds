import mongoose from "mongoose";
import product from "./product.model.js";
const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    }],
    Price: {
        type: Number,
        required: true,
        min: 0,
    },
   totalAmount:{
    type: Number,
    required: true,
    min: 0,
   },
   stripeSessionId: {
    type: String,
    required: true,
    unique: true,
   },

}

, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order