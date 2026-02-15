import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../services/checkoutApi";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const AdminOrders = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorText, setErrorText] = useState("");
  const [draftStatus, setDraftStatus] = useState({});

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAllOrdersAdmin,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatusAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setErrorText("");
    },
    onError: (error) => {
      setErrorText(error?.response?.data?.message || "Status update failed");
    },
  });

  const safeOrders = useMemo(
    () =>
      Array.isArray(orders)
        ? [...orders].sort(
            (a, b) =>
              new Date(b?.placedAt || b?.createdAt || 0) -
              new Date(a?.placedAt || a?.createdAt || 0)
          )
        : [],
    [orders]
  );

  const onUpdateStatus = (id, fallbackStatus) => {
    const status = draftStatus[id] || fallbackStatus || "pending";
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Orders</h1>

        {errorText && (
          <p className="text-sm text-red-600 mb-4 bg-red-50 border border-red-200 rounded p-3">
            {errorText}
          </p>
        )}

        <div className="bg-white border rounded-xl p-5">
          {isLoading ? (
            <p>Yuklanmoqda...</p>
          ) : safeOrders.length === 0 ? (
            <p>Hozircha order yo'q.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-2">Order</th>
                    <th className="py-2 pr-2">Customer</th>
                    <th className="py-2 pr-2">Placed</th>
                    <th className="py-2 pr-2">Payment</th>
                    <th className="py-2 pr-2">Total</th>
                    <th className="py-2 pr-2">Status</th>
                    <th className="py-2 pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {safeOrders.map((order) => (
                    <tr key={order.id} className="border-b align-top">
                      <td className="py-2 pr-2">
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </td>
                      <td className="py-2 pr-2">
                        <p>{order.user?.fullName || "-"}</p>
                        <p className="text-xs text-gray-500">
                          {order.user?.email || "-"}
                        </p>
                      </td>
                      <td className="py-2 pr-2">
                        {new Date(order.placedAt || order.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-2">{order.paymentMethod || "-"}</td>
                      <td className="py-2 pr-2">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="py-2 pr-2">
                        <select
                          value={draftStatus[order.id] || order.status || "pending"}
                          onChange={(e) =>
                            setDraftStatus((prev) => ({
                              ...prev,
                              [order.id]: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 pr-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="px-3 py-1 rounded border"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(order.id, order.status)}
                            disabled={updateStatusMutation.isPending}
                            className="px-3 py-1 rounded bg-black text-white disabled:opacity-60"
                          >
                            Save
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
