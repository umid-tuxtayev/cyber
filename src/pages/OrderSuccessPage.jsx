import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmStripeOrder } from "../services/checkoutApi";
import { useCart } from "../context/CartContext";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Confirming payment...");
  const [isError, setIsError] = useState(false);
  const processedRef = useRef(false);
  const { clearCart } = useCart();

  const confirmMutation = useMutation({
    mutationFn: confirmStripeOrder,
  });

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const sessionId =
      searchParams.get("sessionId") ||
      searchParams.get("session_id") ||
      searchParams.get("sid");

    const run = async () => {
      try {
        if (sessionId) {
          await confirmMutation.mutateAsync({ sessionId });
        }

        await clearCart();
        sessionStorage.removeItem("checkout.addressId");
        sessionStorage.removeItem("checkout.shippingMethod");
        setMessage("Payment confirmed. Order created successfully.");
      } catch (error) {
        setIsError(true);
        setMessage(
          error?.response?.data?.message ||
            "Payment confirmation failed. You can still check your orders."
        );
      }
    };

    run();
  }, [clearCart, confirmMutation, searchParams]);

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-14">
      <div className="container mx-auto px-4 max-w-xl">
        <div
          className={`rounded-lg border p-6 ${
            isError
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          <h1 className="text-xl font-semibold mb-2">
            {isError ? "Payment Status" : "Order Success"}
          </h1>
          <p className="text-sm">{message}</p>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="px-5 py-2.5 rounded bg-black text-white"
          >
            Go to My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded border border-gray-300 bg-white"
          >
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
