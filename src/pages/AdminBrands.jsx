import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBrand,
  deleteBrand,
  fetchBrands,
  updateBrand,
} from "../services/brandApi";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  slug: "",
  logo: null,
};

const AdminBrands = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: fetchBrands,
  });

  const createMutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      resetForm();
      toast.success("Brand yaratildi");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Brand yaratishda xatolik";
      setErrorMessage(message);
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      resetForm();
      toast.success("Brand yangilandi");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Brand yangilashda xatolik";
      setErrorMessage(message);
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      toast.success("Brand o'chirildi");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Brand o'chirishda xatolik";
      setErrorMessage(message);
      toast.error(message);
    },
  });

  const loading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const title = useMemo(
    () => (editingId ? "Brandni yangilash" : "Yangi brand qo'shish"),
    [editingId]
  );

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
    setErrorMessage("");
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.slug.trim()) {
      const message = "name va slug majburiy";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (!editingId && !form.logo) {
      const message = "Yangi brand uchun logo file majburiy";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...form });
      return;
    }

    createMutation.mutate(form);
  };

  const handleEdit = (item) => {
    setEditingId(item.id || item._id);
    setForm({
      name: item.name || "",
      slug: item.slug || "",
      logo: null,
    });
    setErrorMessage("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Brandni o'chirishni tasdiqlaysizmi?")) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Brands</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="bg-white border rounded-xl p-5 space-y-4 h-fit"
          >
            <h2 className="text-lg font-semibold">{title}</h2>

            <div>
              <label className="block text-sm mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Macbook Pro"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Slug *</label>
              <textarea
                value={form.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                placeholder="Brand short description"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Logo {editingId ? "(optional)" : "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleInputChange("logo", e.target.files?.[0] || null)
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {editingId ? "Update" : "Create"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2 bg-white border rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4">Brands ro'yxati</h2>

            {isLoading ? (
              <p>Yuklanmoqda...</p>
            ) : brands.length === 0 ? (
              <p>Hozircha brand yo'q.</p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-2">Logo</th>
                      <th className="py-2 pr-2">Name</th>
                      <th className="py-2 pr-2">Slug</th>
                      <th className="py-2 pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((item) => {
                      const id = item.id || item._id;
                      return (
                        <tr key={id} className="border-b align-top">
                          <td className="py-2 pr-2">
                            {item.logoUrl ? (
                              <img
                                src={item.logoUrl}
                                alt={item.name}
                                className="w-14 h-14 object-cover rounded border"
                              />
                            ) : (
                              <span className="text-gray-400">No logo</span>
                            )}
                          </td>
                          <td className="py-2 pr-2 font-medium">{item.name}</td>
                          <td className="py-2 pr-2 text-gray-600 max-w-[280px]">
                            <p className="line-clamp-2">{item.slug}</p>
                          </td>
                          <td className="py-2 pr-2">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                className="px-3 py-1 rounded border hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(id)}
                                disabled={deleteMutation.isPending}
                                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBrands;
