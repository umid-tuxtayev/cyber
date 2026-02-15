import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../services/checkoutApi";

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order-detail", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            Loading order...
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-[#fafafa] pt-24 pb-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            Order not found or access denied.
          </div>
        </div>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const payments = Array.isArray(order.payments) ? order.payments : [];

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-14">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-4">
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100"
          >
            Back to Orders
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-5">
            <h1 className="text-2xl font-semibold mb-2">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mb-4">{order.id}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-sm">
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium">{order.status}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500">Placed</p>
                <p className="font-medium">
                  {new Date(order.placedAt || order.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Total</p>
                <p className="font-medium">
                  ${Number(order.totalAmount || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-3">Items</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const name =
                  item.snapshotName || item.product?.name || "Unknown product";
                const image =
                  item.product?.images?.[0]?.imageUrl || "/placeholder.svg";
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-gray-200 rounded p-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={image}
                        alt={name}
                        className="w-12 h-12 rounded object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${Number(item.totalPrice || 0).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
              {order.shippingAddress ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium text-black">
                    {order.shippingAddress.recipientName}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>
                    {[order.shippingAddress.line1, order.shippingAddress.line2]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.country,
                      order.shippingAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No shipping address</p>
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-semibold mb-3">Payment Logs</h2>
              {payments.length ? (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="border border-gray-200 rounded p-3 text-sm"
                    >
                      <p>
                        <span className="text-gray-500">Status:</span>{" "}
                        <span className="font-medium">{payment.status}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Amount:</span> $
                        {Number(payment.amount || 0).toFixed(2)}
                      </p>
                      <p className="break-all">
                        <span className="text-gray-500">Txn:</span>{" "}
                        {payment.transactionId || "-"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No payments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
