import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../services/categoryApi";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  slug: "",
  parentId: "",
  icon: null,
};

const AdminCategories = () => {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      resetForm();
      toast.success("Kategoriya yaratildi");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Kategoriya yaratishda xatolik";
      setErrorMessage(message);
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      resetForm();
      toast.success("Kategoriya yangilandi");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Kategoriya yangilashda xatolik";
      setErrorMessage(message);
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategoriya o'chirildi");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Kategoriya o'chirishda xatolik";
      setErrorMessage(message);
      toast.error(message);
    },
  });

  const loading =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const title = useMemo(
    () => (editingId ? "Kategoriyani yangilash" : "Yangi kategoriya qo'shish"),
    [editingId]
  );

  const parentOptions = useMemo(
    () => categories.filter((item) => (item.id || item._id) !== editingId),
    [categories, editingId]
  );

  function resetForm() {
    setForm(initialForm);
    setEditingId("");
    setErrorMessage("");
  }

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
      parentId: item.parentId || item.parent?.id || "",
      icon: null,
    });
    setErrorMessage("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Kategoriyani o'chirishni tasdiqlaysizmi?")) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Categories</h1>

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
                placeholder="Electronics"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="electronics"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Parent Category (optional)</label>
              <select
                value={form.parentId}
                onChange={(e) => handleInputChange("parentId", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No parent</option>
                {parentOptions.map((item) => {
                  const id = item.id || item._id;
                  return (
                    <option key={id} value={id}>
                      {item.name} ({id})
                    </option>
                  );
                })}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Kerakli sectionni tanlang, UUID avtomatik ketadi.
              </p>
            </div>

            <div>
              <label className="block text-sm mb-1">Icon (file)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange("icon", e.target.files?.[0] || null)}
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
            <h2 className="text-lg font-semibold mb-4">Kategoriyalar ro'yxati</h2>

            {isLoading ? (
              <p>Yuklanmoqda...</p>
            ) : categories.length === 0 ? (
              <p>Hozircha kategoriya yo'q.</p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-2">ID</th>
                      <th className="py-2 pr-2">Name</th>
                      <th className="py-2 pr-2">Slug</th>
                      <th className="py-2 pr-2">Parent</th>
                      <th className="py-2 pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((item) => {
                      const id = item.id || item._id;
                      return (
                        <tr key={id} className="border-b">
                          <td className="py-2 pr-2 text-xs text-gray-500">{id}</td>
                          <td className="py-2 pr-2">{item.name}</td>
                          <td className="py-2 pr-2">{item.slug}</td>
                          <td className="py-2 pr-2">
                            {item.parent?.name
                              ? `${item.parent.name} (${item.parent.id})`
                              : item.parentId || "-"}
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

export default AdminCategories;
