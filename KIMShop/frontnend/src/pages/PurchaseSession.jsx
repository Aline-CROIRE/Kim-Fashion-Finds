import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";

const PurchaseSession = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      navigate("/cancel");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axiosInstance.get(`/payments/verify-session?session_id=${sessionId}`);

        if (res.data.status === "success") {
          clearCart();
          navigate("/purchase-success");
        } else {
          navigate("/cancel");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        navigate("/cancel");
      }
    };

    verifyPayment();
  }, [searchParams, navigate, clearCart]);

  return <p>Verifying payment...</p>;
};

export default PurchaseSession;
