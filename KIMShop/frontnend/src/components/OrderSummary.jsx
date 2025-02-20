"use client"

import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { MoveRight } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import axiosInstance from "../../lib/axios"
import { useCartStore } from "../../stores/useCartStore"
import { useState, useEffect } from "react"

const stripePromise = loadStripe("pk_test_51QoM1bLpNUrDfFRrVkEnZCjsqTlP7hWEtOT1CVCLFy9mLon5GQPHZdLS5lEqJCriWLZQSQCEG6RZTcrTlO0sKhVt00TnkmgXsw")

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart, clearCart } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [mobileNumber, setMobileNumber] = useState("")
  const [mobileNumberError, setMobileNumberError] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("initial") // initial, pending, success, failed, error
  const [errorMessage, setErrorMessage] = useState("")

  const savings = subtotal - total
  const formattedSubtotal = subtotal.toFixed(2)
  const formattedTotal = total.toFixed(2)
  const formattedSavings = savings.toFixed(2)

  const navigate = useNavigate()

  const validateMobileNumber = (number) => {
    const regex = /^07[2389]\d{7}$/
    return regex.test(number)
  }

  const handleMobileNumberChange = (e) => {
    const number = e.target.value
    setMobileNumber(number)
    if (number && !validateMobileNumber(number)) {
      setMobileNumberError("Please enter a valid Rwandan mobile number (e.g., 0722123456)")
    } else {
      setMobileNumberError("")
    }
  }

  const handlePayment = async () => {
    setPaymentStatus("pending")
    setErrorMessage("")

    try {
      if (cart.length === 0) {
        console.warn("Cart is empty. Cannot proceed to checkout.")
        setErrorMessage("Your cart is empty.")
        setPaymentStatus("error")
        return
      }

      if ((paymentMethod === "mtn" || paymentMethod === "airtel") && !validateMobileNumber(mobileNumber)) {
        setMobileNumberError("Please enter a valid Rwandan mobile number (e.g., 0722123456)")
        setPaymentStatus("initial")
        return
      }

      const paymentData = {
        products: cart,
        couponCode: coupon ? coupon.code : null,
        paymentMethod: paymentMethod,
      }

      if (paymentMethod === "mtn" || paymentMethod === "airtel") {
        paymentData.mobileNumber = mobileNumber
      }

      // Create checkout session
      const res = await axiosInstance.post("/payments/create-checkout-session", paymentData)

      console.log("Checkout session response:", res.data)
    //   if (res.data || !res.data.id) {
    //     console.error("Invalid session response:", res.data)
    //     setErrorMessage("Payment processing failed. Please try again.")
    //     setPaymentStatus("error")
    //     return
    //   }

      if (paymentMethod === "card") {
        const stripe = await stripePromise
        if (!stripe) {
          console.error("Stripe.js failed to load.")
          setErrorMessage("Failed to load Stripe. Please try again.")
          setPaymentStatus("error")
          return
        }
        // Redirect to Stripe checkout
        const result = await stripe.redirectToCheckout({ sessionId: res.data.id })
        if (result.error) {
          console.error("Stripe Checkout Error:", result.error.message)
          setErrorMessage(`Stripe Checkout Error: ${result.error.message}`)
          setPaymentStatus("error")
        }
      } else {
        // Handle Mobile Money payment response
        if (res.data.status === "pending" && res.data.flutterwaveResponse && res.data.flutterwaveResponse.redirect) {
          window.location.href = res.data.flutterwaveResponse.redirect
          localStorage.setItem("paymentPending", "true")
        } else if (res.data.status === "success") {
          setPaymentStatus("success")
          clearCart()
          navigate("/purchase-success")
          localStorage.removeItem("paymentPending") // Clear pending state
        } else {
          setErrorMessage("Payment failed. Please try again.")
          setPaymentStatus("failed")
        }
      }
    } catch (error) {
      console.error("Payment Processing Error:", error)
      setErrorMessage("Payment processing failed. See console for details.")
      setPaymentStatus("error")
    } finally {
      if (paymentMethod !== "card") {
        setPaymentStatus("initial") // reset after mobile payment attempt
      }
    }
  }

  useEffect(() => {
    // Check if a pending payment exists when the component mounts
    const pendingPayment = localStorage.getItem("paymentPending") === "true"
    if (pendingPayment) {
      setPaymentStatus("pending")
    } else {
      setPaymentStatus("initial") // Reset to initial if no pending payment
    }
    // Clear the local storage when a new user logs in or the component mounts
    localStorage.removeItem("paymentPending")
  }, [])

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-blue-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <dt className="text-sm">Subtotal</dt>
              <dd className="text-sm">{formattedSubtotal} RWF</dd>
            </div>
            {isCouponApplied && (
              <div className="flex items-center justify-between text-blue-400">
                <dt className="text-sm">Discount</dt>
                <dd className="text-sm">- {formattedSavings} RWF</dd>
              </div>
            )}
            <div className="flex items-center justify-between text-gray-400">
              <dt className="text-sm">Delivery</dt>
              <dd className="text-sm">Free</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-600 pt-2 text-white">
              <dt className="font-medium">Total</dt>
              <dd className="font-medium">{formattedTotal} RWF</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white"
            disabled={paymentStatus === "pending"}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="mtn">MTN Mobile Money</option>
            <option value="airtel">Airtel Money</option>
          </select>
        </div>

        {(paymentMethod === "mtn" || paymentMethod === "airtel") && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Mobile Number</label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              placeholder="Enter your mobile number (e.g., 0722123456)"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white"
              disabled={paymentStatus === "pending"}
            />
            {mobileNumberError && <p className="text-red-500 text-xs mt-1">{mobileNumberError}</p>}
          </div>
        )}

        <motion.button
          className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-emerald-300
            ${paymentStatus === "pending" ? "bg-gray-500 cursor-not-allowed" : " bg-[#8C9EFF] hover:bg-blue-400"}`}
          whileHover={{ scale: paymentStatus === "pending" ? 1 : 1.05 }}
          whileTap={{ scale: paymentStatus === "pending" ? 1 : 0.95 }}
          onClick={handlePayment}
          disabled={paymentStatus === "pending"}
        >
          {paymentStatus === "pending"
            ? "Processing Payment..."
            : paymentMethod === "card"
              ? "Proceed to Checkout"
              : "Pay with Mobile Money"}
        </motion.button>

        {errorMessage && <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>}

        {paymentStatus === "pending" && (
          <div className="text-center text-gray-400">
            <p>Please wait, redirecting to payment gateway...</p>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className="text-center text-blue-500">
            <p>Payment successful! Redirecting to success page...</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium underline hover: text-[#8C9EFF] hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default OrderSummary
