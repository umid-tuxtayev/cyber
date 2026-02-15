import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  createOrder,
  createStripeCheckoutSession,
  getMyAddresses,
  getMyCart,
} from "../services/checkoutApi";
import { useCart } from "../context/CartContext";

const shippingMeta = {
  free: { label: "Regular shipment", price: 0 },
  express: { label: "Express shipment", price: 8.5 },
  pickup: { label: "Pickup", price: 0 },
};

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const selectedAddressId = sessionStorage.getItem("checkout.addressId");
  const selectedShippingMethod =
    sessionStorage.getItem("checkout.shippingMethod") || "free";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!selectedAddressId) {
      navigate("/checkout/address", { replace: true });
    }
  }, [navigate, selectedAddressId]);

  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ["checkout-cart"],
    queryFn: getMyCart,
  });

  const { data: addresses = [] } = useQuery({
    queryKey: ["checkout-addresses"],
    queryFn: getMyAddresses,
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,
  });

  const stripeMutation = useMutation({
    mutationFn: createStripeCheckoutSession,
  });

  const selectedAddress = useMemo(
    () => addresses.find((item) => item.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const items = Array.isArray(cart?.items) ? cart.items : [];
  const subtotal = Number(
    cart?.subtotal ??
      items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  const shipping = shippingMeta[selectedShippingMethod] || shippingMeta.free;
  const total = subtotal + shipping.price;

  const handlePay = async () => {
    setErrorText("");
    setSuccessText("");

    if (!selectedAddressId) {
      setErrorText("Shipping address is missing.");
      return;
    }

    if (!items.length) {
      setErrorText("Cart is empty.");
      return;
    }

    try {
      const orderPayload = {
        shippingAddressId: selectedAddressId,
        billingAddressId: selectedAddressId,
        paymentMethod: "stripe",
        notes: `Shipping: ${shipping.label}`,
      };

      const created = await orderMutation.mutateAsync(orderPayload);
      const orderId = created?.id || created?.order?.id;

      if (orderId) {
        try {
          const session = await stripeMutation.mutateAsync(orderId);
          const url =
            session?.url || session?.checkoutUrl || session?.sessionUrl;
          if (url) {
            window.location.href = url;
            return;
          }
        } catch {
          // Stripe session might be optional in some environments.
        }
      }

      await clearCart();
      sessionStorage.removeItem("checkout.addressId");
      sessionStorage.removeItem("checkout.shippingMethod");
      setSuccessText("Order created successfully.");
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      setErrorText(error?.response?.data?.message || "Order create failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-14">
      <div className="container mx-auto px-4">
        <CheckoutSteps activeStep={3} />

        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>

            {cartLoading ? (
              <p className="text-sm text-gray-500">Loading cart...</p>
            ) : !items.length ? (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>${shipping.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>

            <div className="space-y-3 mb-5">
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Card Number"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="EXP"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="rounded-md border border-gray-200 p-3 bg-gray-50 mb-5">
              <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
              {selectedAddress ? (
                <p className="text-sm">
                  {selectedAddress.recipientName}, {selectedAddress.line1},{" "}
                  {selectedAddress.city}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Address not found</p>
              )}
            </div>

            {errorText && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-3">
                {errorText}
              </p>
            )}
            {successText && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3 mb-3">
                {successText}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/checkout/shipping")}
                className="w-full border border-gray-300 rounded py-2.5"
              >
                Back
              </button>
              <button
                onClick={handlePay}
                disabled={orderMutation.isPending || stripeMutation.isPending}
                className="w-full bg-black text-white rounded py-2.5 disabled:opacity-60"
              >
                {orderMutation.isPending || stripeMutation.isPending
                  ? "Processing..."
                  : "Pay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
