import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createCheckoutSession, checkoutSuccess, checkMobileMoneyStatus } from "../controllers/payment.controller.js"

const router = express.Router()

router.post("/create-checkout-session", protectRoute, createCheckoutSession)
router.post("/checkout-success", protectRoute, checkoutSuccess)
router.get("/mobile-money-status/:orderId", protectRoute, checkMobileMoneyStatus)

export default router

