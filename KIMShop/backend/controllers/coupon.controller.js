import Coupon from "../models/coupon.model.js";

// Get active coupon for the user
export const getCoupon = async (req, res) => {
    try {
        const foundCoupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
        if (!foundCoupon) {
            return res.status(404).json({ message: "No active coupon found" });
        }
        res.json(foundCoupon);
    } catch (error) {
        console.error("Error in getCoupon controller:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Validate a coupon
export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const foundCoupon = await Coupon.findOne({ code, userId: req.user._id, isActive: true });

        if (!foundCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        if (foundCoupon.expirationDate < new Date()) {
            foundCoupon.isActive = false;
            await foundCoupon.save();
            return res.status(400).json({ message: "Coupon expired" });
        }

        res.json({
            message: "Coupon is valid",
            code: foundCoupon.code,
            discountPercentage: foundCoupon.discountPercentage,
        });

    } catch (error) {
        console.error("Error in validateCoupon controller:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export default { getCoupon, validateCoupon };
