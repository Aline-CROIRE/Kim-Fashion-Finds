import Order from "../models/order.model.js";
import Flutterwave from "flutterwave-node-v3";

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

export const initiateMobileMoneyPayment = async ({ amount, mobileNumber, provider, userId, products, couponCode }) => {
  try {
    // Create a unique transaction reference (order_id)
    const tx_ref = `MM-${Date.now()}-${userId}`; // Added userId for uniqueness

    const payload = {
      tx_ref: tx_ref,       // For internal tracking
      order_id: tx_ref,     // Satisfies Flutterwave's validator
      amount: amount,
      currency: "RWF",
      network: provider === "mtn" ? "MTN" : "AIRTEL",
      email: "customer@example.com",  // Replace with dynamic user email if available
      phone_number: mobileNumber,
      fullname: "John Doe",             // Replace with user's name if available
      redirect_url: `${process.env.CLIENT_URL}/payment-callback`,
    };

    // Initiate payment via Flutterwave
    const response = await flw.MobileMoney.rwanda(payload);
    console.log("Flutterwave response:", response);

    // Validate response status
    if (response.status !== "success") {
      console.error("Flutterwave returned an unsuccessful status:", response);
      throw new Error(`Failed to initiate Mobile Money payment: ${response.message}`);
    }

    // Determine transaction identifier and reference based on response structure
    let transactionId, flutterwaveRef;
    if (response.data && response.data.id) {
      // Old structure
      transactionId = response.data.id;
      flutterwaveRef = response.data.flw_ref;
    } else if (response.meta && response.meta.authorization) {
      // New structure fallback
      transactionId = tx_ref;
      flutterwaveRef = response.meta.authorization.redirect;
    } else {
      throw new Error("Invalid response from Flutterwave: missing expected properties.");
    }

    // Log product details to ensure correct structure
    console.log("Products received:", products);

    // Create a new order in your database
    const newOrder = new Order({
      user: userId,
      products: products.map((product) => ({
        product: product._id || product.id, // Use _id if available, else id
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: amount,
      paymentMethod: provider,
      mobileNumber,
      status: "pending",
      couponUsed: couponCode,
      transactionId: transactionId,
      flutterwaveRef: flutterwaveRef,
      orderId: tx_ref,
    });

    await newOrder.save();

    // Return response for further client handling
    return {
      status: "pending",
      message: "Mobile Money payment initiated",
      orderId: newOrder._id,
      flutterwaveResponse: response.meta ? response.meta.authorization : response.data,
    };
  } catch (error) {
    console.error("Error initiating Mobile Money payment:", error);
    throw new Error(`Payment initiation error: ${error.message}`);
  }
};

export const verifyMobileMoneyPayment = async (transactionId) => {
  try {
    const response = await flw.Transaction.verify({ id: transactionId });
    console.log("Verification response:", response);

    if (response.data && response.data.status === "successful") {
      // Update order status if payment is verified
      const updatedOrder = await Order.findOneAndUpdate(
        { transactionId: transactionId },
        { status: "completed" },
        { new: true } // Return the updated document
      );

      if (!updatedOrder) {
        throw new Error("Order not found for the given transaction ID.");
      }

      return { status: "success", message: "Payment verified successfully" };
    } else {
      return { status: "failed", message: "Payment verification failed" };
    }
  } catch (error) {
    console.error("Error verifying Mobile Money payment:", error);
    throw new Error(`Payment verification error: ${error.message}`);
  }
};

export default { initiateMobileMoneyPayment, verifyMobileMoneyPayment };
