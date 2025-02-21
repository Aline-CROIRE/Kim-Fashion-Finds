import Coupon from "../models/coupon.model.js";
import { stripe } from "../lib/stripe.js";
import { initiateMobileMoneyPayment, verifyMobileMoneyPayment } from "../lib/mobileMoney.js";
import Order from "../models/order.model.js";

// Helper function to create a Stripe coupon
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}

// Helper function to create a new coupon for the user


// Create a checkout session

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}
		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};
// Check mobile money transaction status
export const checkMobileMoneyStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "completed") {
      return res.json({ status: order.status });
    }

    if (order.status === "pending") {
      const verificationResult = await verifyMobileMoneyPayment(order.transactionId);
      if (verificationResult.status === "success") {
        order.status = "completed";
        await order.save();
      }
    }

    res.json({ status: order.status });
  } catch (error) {
    console.error("Error checking Mobile Money status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Handle checkout success


export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    console.log("🟢 Received sessionId:", sessionId);

    if (!sessionId) {
      return res.status(400).json({ message: "No session ID provided" });
    }

    // 🔍 Check if the order already exists BEFORE calling Stripe
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      console.log("⚠️ Order already exists for this session.");
      return res.status(200).json({ status: "success", message: "Order already exists" });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("🟢 Stripe session:", session);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    if (!session.metadata || !session.metadata.products || !session.metadata.userId) {
      return res.status(400).json({ message: "Invalid session metadata" });
    }

    const products = JSON.parse(session.metadata.products);

    const newOrder = new Order({
      user: session.metadata.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: session.amount_total / 100,
      stripeSessionId: session.id, // 🔥 Ensure this is set correctly
      status: "completed",
      paymentMethod: session.payment_method_types[0] || "card",
    });

    console.log("🟢 Saving new order:", newOrder);
    await newOrder.save();

    console.log("✅ Order saved successfully");

    res.status(200).json({ status: "success", message: "Payment verified and order created." });
  } catch (error) {
    console.error("❌ Checkout Success Error:", error);
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
};
