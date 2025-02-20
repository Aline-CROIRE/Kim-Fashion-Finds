import Order from "../models/order.model.js";

export const handleFlutterwaveWebhook = async (req, res) => {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    // Verify the signature
    if (!signature || signature !== secretHash) {
      console.warn("Unauthorized request: Invalid signature");
      return res.status(401).send("Unauthorized");
    }

    const payload = req.body;

    // Check for charge completed event
    if (payload.event === "charge.completed" && payload.data.status === "successful") {
      const order = await Order.findOne({ flutterwaveRef: payload.data.flw_ref });

      if (order) {
        order.status = "completed";
        await order.save();

        // Here you might want to trigger other actions like sending a confirmation email, updating inventory, etc.
        console.log(`Order ${order._id} marked as completed.`);
      } else {
        console.warn(`Order not found for flutterwaveRef: ${payload.data.flw_ref}`);
      }
    } else {
      console.warn(`Unhandled event type: ${payload.event}`);
    }

    // Send a 200 response regardless of the outcome
    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default handleFlutterwaveWebhook;
