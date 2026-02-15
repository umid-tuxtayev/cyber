import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../services/checkoutApi";
import { useNavigate } from "react-router-dom";

const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "paid":
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
    case "refunded":
      return "bg-red-100 text-red-700";
    case "shipped":
    case "processing":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  const safeOrders = Array.isArray(orders)
    ? [...orders].sort(
        (a, b) =>
          new Date(b?.placedAt || b?.createdAt || 0) -
          new Date(a?.placedAt || a?.createdAt || 0)
      )
    : [];

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-14">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My Orders</h1>

        {isLoading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            Loading orders...
          </div>
        ) : safeOrders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-gray-600">You do not have any order yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {safeOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.id}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.placedAt || order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex mt-1 px-2 py-1 rounded text-xs font-medium ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status || "pending"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
