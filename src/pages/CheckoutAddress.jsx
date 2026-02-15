import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  createAddress,
  deleteAddress,
  getMyAddresses,
  updateAddress,
} from "../services/checkoutApi";

const defaultForm = {
  type: "shipping",
  recipientName: "",
  phone: "",
  country: "",
  city: "",
  state: "",
  postalCode: "",
  line1: "",
  line2: "",
  isDefault: false,
};

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["checkout-addresses"],
    queryFn: getMyAddresses,
  });

  useEffect(() => {
    if (!addresses.length) return;

    const stored = sessionStorage.getItem("checkout.addressId");
    const firstDefault = addresses.find((a) => a.isDefault)?.id;
    const fallback = firstDefault || addresses[0]?.id || "";
    const selected = addresses.some((a) => a.id === stored) ? stored : fallback;
    setSelectedAddressId(selected);
  }, [addresses]);

  const createMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ["checkout-addresses"] });
      setSelectedAddressId(created?.id || "");
      setForm(defaultForm);
      setEditingId("");
      setShowForm(false);
      setErrorText("");
    },
    onError: (error) => {
      setErrorText(error?.response?.data?.message || "Address create failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["checkout-addresses"] });
      setForm(defaultForm);
      setEditingId("");
      setShowForm(false);
      setErrorText("");
    },
    onError: (error) => {
      setErrorText(error?.response?.data?.message || "Address update failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: async (_, deletedId) => {
      await queryClient.invalidateQueries({ queryKey: ["checkout-addresses"] });
      if (selectedAddressId === deletedId) {
        setSelectedAddressId("");
      }
    },
  });

  const onEdit = (item) => {
    setForm({
      type: item.type || "shipping",
      recipientName: item.recipientName || "",
      phone: item.phone || "",
      country: item.country || "",
      city: item.city || "",
      state: item.state || "",
      postalCode: item.postalCode || "",
      line1: item.line1 || "",
      line2: item.line2 || "",
      isDefault: !!item.isDefault,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const busy = createMutation.isPending || updateMutation.isPending;

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const onSubmit = (event) => {
    event.preventDefault();
    setErrorText("");

    if (!form.recipientName || !form.phone || !form.city || !form.line1) {
      setErrorText("Recipient, phone, city and address line 1 are required.");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...form });
      return;
    }

    createMutation.mutate(form);
  };

  const onNext = () => {
    if (!selectedAddressId) {
      setErrorText("Please select one address.");
      return;
    }

    sessionStorage.setItem("checkout.addressId", selectedAddressId);
    navigate("/checkout/shipping");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-14">
      <div className="container mx-auto px-4">
        <CheckoutSteps activeStep={1} />

        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Select Address</h1>
              <button
                onClick={() => {
                  setEditingId("");
                  setForm(defaultForm);
                  setShowForm((prev) => !prev);
                }}
                className="border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-100"
              >
                {showForm ? "Close Form" : "Add New Address"}
              </button>
            </div>

            {isLoading && (
              <div className="rounded-lg bg-white border border-gray-200 p-5">
                Loading addresses...
              </div>
            )}

            {!isLoading && !addresses.length && (
              <div className="rounded-lg bg-white border border-gray-200 p-5 text-gray-600">
                No address found. Add one to continue checkout.
              </div>
            )}

            {addresses.map((address) => (
              <label
                key={address.id}
                className={`block rounded-lg border p-4 bg-white cursor-pointer ${
                  selectedAddressId === address.id
                    ? "border-black"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">
                        {address.recipientName}{" "}
                        {address.isDefault && (
                          <span className="text-xs text-gray-500">
                            (Default)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-700">{address.phone}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {[address.line1, address.line2].filter(Boolean).join(", ")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {[address.city, address.state, address.postalCode, address.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onEdit(address);
                      }}
                      className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteMutation.mutate(address.id);
                      }}
                      className="text-sm border border-red-200 text-red-600 rounded px-3 py-1.5 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold mb-3">
                {editingId ? "Update Address" : "New Address"}
              </h2>

              {showForm ? (
                <form onSubmit={onSubmit} className="space-y-3">
                  <input
                    placeholder="Recipient Name"
                    value={form.recipientName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        recipientName: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Country"
                    value={form.country}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, country: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="City"
                      value={form.city}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="State"
                      value={form.state}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, state: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <input
                    placeholder="Postal Code"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        postalCode: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Address Line 1"
                    value={form.line1}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, line1: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Address Line 2"
                    value={form.line2}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, line2: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isDefault: e.target.checked,
                        }))
                      }
                    />
                    Set as default
                  </label>
                  <button
                    disabled={busy}
                    className="w-full bg-black text-white rounded-md py-2 text-sm disabled:opacity-60"
                  >
                    {busy ? "Saving..." : editingId ? "Update" : "Save Address"}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-gray-500">
                  Click <span className="font-medium">Add New Address</span> to
                  create one or edit existing.
                </p>
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold mb-3">Selected Address</h2>
              {selectedAddress ? (
                <div className="text-sm space-y-1 text-gray-700">
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
                <p className="text-sm text-gray-500">No address selected.</p>
              )}
            </div>

            {errorText && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                {errorText}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 flex justify-end gap-3">
          <button
            onClick={() => navigate("/cart")}
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

export default CheckoutAddress;
