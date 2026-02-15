import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsCategory,
  updateProduct,
} from "../services/api";
import { fetchBrands } from "../services/brandApi";

const initialForm = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  price: "",
  compareAtPrice: "",
  currency: "USD",
  stock: 0,
  isActive: true,
  isFeatured: false,
  categoryId: "",
  brandId: "",
  images: [],
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState(initialForm);

  const { data: productResponse, isLoading } = useQuery({
    queryKey: ["admin-products", page],
    queryFn: () => getProducts({ queryKey: ["products", { limit: 12, skip: (page - 1) * 12 }] }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-product-categories"],
    queryFn: getProductsCategory,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["admin-product-brands"],
    queryFn: fetchBrands,
  });

  const products = productResponse?.products || [];
  const meta = productResponse?.meta || {};

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      resetForm();
    },
    onError: (error) => {
      setErrorMessage(error?.response?.data?.message || "Mahsulot yaratishda xatolik");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      resetForm();
    },
    onError: (error) => {
      setErrorMessage(error?.response?.data?.message || "Mahsulot yangilashda xatolik");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => {
      setErrorMessage(error?.response?.data?.message || "Mahsulot o'chirishda xatolik");
    },
  });

  const loading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const title = useMemo(
    () => (editingId ? "Mahsulotni yangilash" : "Yangi mahsulot qo'shish"),
    [editingId]
  );

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
    setErrorMessage("");
  };

  const handleInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.sku || !form.price || !form.categoryId) {
      setErrorMessage("name, slug, sku, price, categoryId majburiy");
      return;
    }

    const payload = {
      ...form,
      stock: Number(form.stock || 0),
      images: form.images,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
      return;
    }
    createMutation.mutate(payload);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      slug: item.slug || "",
      sku: item.sku || "",
      description: item.description || "",
      price: item.price || "",
      compareAtPrice: item.compareAtPrice || "",
      currency: item.currency || "USD",
      stock: item.stock || 0,
      isActive: Boolean(item.isActive),
      isFeatured: Boolean(item.isFeatured),
      categoryId: item.category?.id || "",
      brandId: item.brand?.id || "",
      images: [],
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Products</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-5 space-y-3 h-fit">
            <h2 className="text-lg font-semibold">{title}</h2>

            <input value={form.name} onChange={(e) => handleInput("name", e.target.value)} placeholder="Name *" className="w-full border rounded-lg px-3 py-2" />
            <input value={form.slug} onChange={(e) => handleInput("slug", e.target.value)} placeholder="Slug *" className="w-full border rounded-lg px-3 py-2" />
            <input value={form.sku} onChange={(e) => handleInput("sku", e.target.value)} placeholder="SKU *" className="w-full border rounded-lg px-3 py-2" />
            <textarea value={form.description} onChange={(e) => handleInput("description", e.target.value)} placeholder="Description" className="w-full border rounded-lg px-3 py-2 min-h-20" />
            <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => handleInput("price", e.target.value)} placeholder="Price *" className="w-full border rounded-lg px-3 py-2" />
            <input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={(e) => handleInput("compareAtPrice", e.target.value)} placeholder="Compare At Price" className="w-full border rounded-lg px-3 py-2" />
            <input value={form.currency} onChange={(e) => handleInput("currency", e.target.value)} placeholder="Currency" className="w-full border rounded-lg px-3 py-2" />
            <input type="number" min="0" value={form.stock} onChange={(e) => handleInput("stock", e.target.value)} placeholder="Stock" className="w-full border rounded-lg px-3 py-2" />

            <select value={form.categoryId} onChange={(e) => handleInput("categoryId", e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select category *</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select value={form.brandId} onChange={(e) => handleInput("brandId", e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option value="">Select brand (optional)</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleInput("images", Array.from(e.target.files || []))}
              className="w-full border rounded-lg px-3 py-2"
            />

            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => handleInput("isActive", e.target.checked)} />
                Active
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => handleInput("isFeatured", e.target.checked)} />
                Featured
              </label>
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <div className="flex gap-2">
              <button disabled={loading} type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60">
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2 bg-white border rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4">Mahsulotlar</h2>

            {isLoading ? (
              <p>Yuklanmoqda...</p>
            ) : products.length === 0 ? (
              <p>Mahsulot topilmadi.</p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-2">Name</th>
                      <th className="py-2 pr-2">SKU</th>
                      <th className="py-2 pr-2">Price</th>
                      <th className="py-2 pr-2">Stock</th>
                      <th className="py-2 pr-2">Category</th>
                      <th className="py-2 pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 pr-2">{item.name}</td>
                        <td className="py-2 pr-2">{item.sku}</td>
                        <td className="py-2 pr-2">${item.price}</td>
                        <td className="py-2 pr-2">{item.stock}</td>
                        <td className="py-2 pr-2">{item.category?.name || "-"}</td>
                        <td className="py-2 pr-2">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(item)} className="px-3 py-1 rounded border" type="button">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deleteMutation.isPending}
                              className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-60"
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={!meta?.hasPrevPage}
                className="px-3 py-2 rounded border disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-2 text-sm">Page {meta?.page || page}</span>
              <button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!meta?.hasNextPage}
                className="px-3 py-2 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
