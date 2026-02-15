import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Admin bo'limlariga tezkor kirish.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="text-left rounded-xl border bg-white p-5 hover:shadow-sm"
          >
            <p className="font-semibold text-lg">Products</p>
            <p className="text-sm text-gray-600 mt-1">
              Mahsulot qo'shish, yangilash, o'chirish
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="text-left rounded-xl border bg-white p-5 hover:shadow-sm"
          >
            <p className="font-semibold text-lg">Categories</p>
            <p className="text-sm text-gray-600 mt-1">
              Kategoriya qo'shish, yangilash, o'chirish
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/brands")}
            className="text-left rounded-xl border bg-white p-5 hover:shadow-sm"
          >
            <p className="font-semibold text-lg">Brands</p>
            <p className="text-sm text-gray-600 mt-1">
              Brand qo'shish, yangilash, o'chirish
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="text-left rounded-xl border bg-white p-5 hover:shadow-sm"
          >
            <p className="font-semibold text-lg">Orders</p>
            <p className="text-sm text-gray-600 mt-1">
              Barcha buyurtmalar va status boshqaruvi
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
