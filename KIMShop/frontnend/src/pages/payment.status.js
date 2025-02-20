"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axiosInstance from "../../lib/axios"

const PaymentStatus = () => {
  const { orderId } = useParams()
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axiosInstance.get(`/payments/mobile-money-status/${orderId}`)
        setStatus(response.data.status)
      } catch (err) {
        console.error("Error checking payment status:", err)
        setError("Failed to fetch payment status. Please try again later.")
      }
    }

    const intervalId = setInterval(checkStatus, 5000) // Check every 5 seconds

    return () => clearInterval(intervalId)
  }, [orderId])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Payment Status</h1>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            {status === "loading" && (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            )}
            {status === "pending" && (
              <p className="text-yellow-500 text-center">Your payment is being processed. Please wait...</p>
            )}
            {status === "completed" && (
              <p className="text-green-500 text-center">Payment successful! Thank you for your purchase.</p>
            )}
            {status === "failed" && (
              <p className="text-red-500 text-center">Payment failed. Please try again or contact support.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentStatus

