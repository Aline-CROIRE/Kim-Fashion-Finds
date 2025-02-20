import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/analytic.route.js"
import webhookRoutes from "./routes/webhook.route.js"

import { connectDB } from "./lib/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/webhook", webhookRoutes)

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT)
  connectDB()
})

