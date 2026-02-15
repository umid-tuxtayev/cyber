import { useNavigate } from "react-router-dom";
import { useLikes } from "../context/LikeContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

const Likes = () => {
  const { likedItems, removeFromLikes } = useLikes();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (event, item) => {
    event.stopPropagation();
    try {
      await addToCart({
        id: item.id,
        name: item.name || item.title,
        image: item.image || "/placeholder.svg",
        price: Number(item.price || 0),
        quantity: 1,
        size: "Default",
        color: "Default",
      });
      toast.success("Mahsulot savatchaga qo'shildi.");
    } catch (error) {
      console.error(error);
      toast.error("Xato: mahsulot qo'shilmadi.");
    }
  };

  if (likedItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        Hech qanday like qilingan mahsulot yo‘q.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen pt-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Liked Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {likedItems.map((item) => (
          <div
            onClick={() => navigate(`/product/${item.id}`)}
            key={item.id}
            className="bg-white dark:bg-gray-600 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition hover:shadow-lg"
          >
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title || item.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {item.title || item.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">${item.price}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={(event) => handleAddToCart(event, item)}
                className="w-full inline-flex items-center justify-center gap-2 text-white bg-gray-900 hover:bg-gray-800 rounded py-2 transition"
              >
                <ShoppingCart className="h-4 w-4" />
                Add
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  removeFromLikes(item.id);
                }}
                className="w-full text-red-500 border border-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded py-2 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Likes;
