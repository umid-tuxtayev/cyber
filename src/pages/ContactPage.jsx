import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Xabar yuborildi.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-200 py-20 px-6 text-black dark:text-white dark:bg-gray-600">
      <h1 className="text-4xl font-bold text-center mb-10">Biz bilan bog‘laning</h1>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-gray-900 dark:text-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Ismingiz</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Xabaringiz</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-black text-white dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 px-6 py-2 rounded-md font-semibold"
          >
            Yuborish
          </button>
        </form>
      </div>
    </div>
  );
}
