import { api } from "./api";

const unwrap = (payload) => payload?.data ?? payload;

const mapCartItem = (item) => {
  const quantity = Number(item?.quantity ?? 1);
  const price = Number(
    item?.unitPrice ?? item?.price ?? item?.product?.price ?? 0
  );

  return {
    id: item?.id || item?.itemId || item?.productId || item?.product?.id,
    productId: item?.productId || item?.product?.id,
    name: item?.product?.name || item?.name || "Product",
    image:
      item?.product?.images?.[0]?.imageUrl ||
      item?.product?.thumbnail ||
      item?.image ||
      "/placeholder.svg",
    quantity,
    price,
    lineTotal: Number(item?.lineTotal ?? quantity * price),
  };
};

export const normalizeCart = (payload) => {
  const cart = unwrap(payload) || {};
  const items = Array.isArray(cart?.items)
    ? cart.items
    : Array.isArray(cart?.cartItems)
    ? cart.cartItems
    : [];
  const mappedItems = items.map(mapCartItem);
  const subtotal = Number(
    cart?.subtotal ??
      mappedItems.reduce((acc, item) => acc + item.lineTotal, 0)
  );

  return {
    ...cart,
    items: mappedItems,
    subtotal,
    total: Number(cart?.total ?? subtotal),
  };
};

export const getMyAddresses = async () => {
  const res = await api.get("/addresses/me");
  const payload = unwrap(res.data);
  return Array.isArray(payload) ? payload : [];
};

export const createAddress = async (payload) => {
  const res = await api.post("/addresses", payload);
  return unwrap(res.data);
};

export const updateAddress = async ({ id, ...payload }) => {
  const res = await api.put(`/addresses/${id}`, payload);
  return unwrap(res.data);
};

export const deleteAddress = async (id) => {
  const res = await api.delete(`/addresses/${id}`);
  return unwrap(res.data);
};

export const getMyCart = async () => {
  const res = await api.get("/cart/me");
  return normalizeCart(res.data);
};

export const addCartItem = async (payload) => {
  const res = await api.post("/cart/items", payload);
  return unwrap(res.data);
};

export const updateCartItem = async ({ itemId, quantity }) => {
  const res = await api.put(`/cart/items/${itemId}`, { quantity });
  return unwrap(res.data);
};

export const removeCartItem = async (itemId) => {
  const res = await api.delete(`/cart/items/${itemId}`);
  return unwrap(res.data);
};

export const clearCartItems = async () => {
  const res = await api.delete("/cart/clear");
  return unwrap(res.data);
};

export const createOrder = async (payload) => {
  const res = await api.post("/orders", payload);
  return unwrap(res.data);
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/me");
  const payload = unwrap(res.data);
  return Array.isArray(payload) ? payload : [];
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return unwrap(res.data);
};

export const createStripeCheckoutSession = async (id) => {
  const res = await api.post(`/orders/${id}/stripe/checkout-session`);
  return unwrap(res.data);
};

export const confirmStripeOrder = async (payload) => {
  const res = await api.post("/orders/stripe/confirm", payload);
  return unwrap(res.data);
};

export const getAllOrdersAdmin = async () => {
  const res = await api.get("/orders/admin/all");
  const payload = unwrap(res.data);
  return Array.isArray(payload) ? payload : [];
};

export const updateOrderStatusAdmin = async ({ id, status }) => {
  const res = await api.put(`/orders/admin/${id}/status`, { status });
  return unwrap(res.data);
};
