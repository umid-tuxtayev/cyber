import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { getMyAddresses } from "../services/checkoutApi";

const SHIPPING_OPTIONS = [
  {
    id: "free",
    title: "Free",
    description: "Regular shipment",
    eta: "17 Oct, 2025",
    price: 0,
  },
  {
    id: "express",
    title: "$8.50",
    description: "Express shipment",
    eta: "1 Oct, 2025",
    price: 8.5,
  },
  {
    id: "pickup",
    title: "Schedule",
    description: "Pickup in nearest post office",
    eta: "Select Date",
    price: 0,
  },
];

const CheckoutShipping = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(
    () => sessionStorage.getItem("checkout.shippingMethod") || "free"
  );
  const selectedAddressId = sessionStorage.getItem("checkout.addressId");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!selectedAddressId) {
      navigate("/checkout/address", { replace: true });
    }
  }, [navigate, selectedAddressId]);

  const { data: addresses = [] } = useQuery({
    queryKey: ["checkout-addresses"],
    queryFn: getMyAddresses,
  });

  const selectedAddress = useMemo(
    () => addresses.find((item) => item.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const onNext = () => {
    sessionStorage.setItem("checkout.shippingMethod", selectedMethod);
    navigate("/checkout/payment");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-14">
      <div className="container mx-auto px-4">
        <CheckoutSteps activeStep={2} />

        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-semibold mb-4">Shipment Method</h1>
            <div className="space-y-3">
              {SHIPPING_OPTIONS.map((method) => (
                <label
                  key={method.id}
                  className={`block rounded-lg border bg-white p-4 cursor-pointer ${
                    selectedMethod === method.id
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={selectedMethod === method.id}
                        onChange={() => setSelectedMethod(method.id)}
                      />
                      <div>
                        <p className="font-medium">{method.description}</p>
                        <p className="text-xs text-gray-500">{method.eta}</p>
                      </div>
                    </div>
                    <p className="font-medium">{method.title}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold mb-3">Ship To</h2>
              {selectedAddress ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium text-black">
                    {selectedAddress.recipientName}
                  </p>
                  <p>{selectedAddress.phone}</p>
                  <p>
                    {[selectedAddress.line1, selectedAddress.line2]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>
                    {[selectedAddress.city, selectedAddress.state, selectedAddress.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Address not found.</p>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 flex justify-end gap-3">
          <button
            onClick={() => navigate("/checkout/address")}
            className="px-8 py-2.5 rounded border border-gray-300 bg-white"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-8 py-2.5 rounded bg-black text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutShipping;
