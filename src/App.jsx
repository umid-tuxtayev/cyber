import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Layout = lazy(() => import("./components/Layout"));
const Home = lazy(() => import("./pages/Home"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Profile = lazy(() => import("./pages/Profile"));
const Likes = lazy(() => import("./pages/Likes"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminBrands = lazy(() => import("./pages/AdminBrands"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const CheckoutAddress = lazy(() => import("./pages/CheckoutAddress"));
const CheckoutShipping = lazy(() => import("./pages/CheckoutShipping"));
const CheckoutPayment = lazy(() => import("./pages/CheckoutPayment"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));

const App = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route
            path="orders/success"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="order/success"
            element={
              <ProtectedRoute>
                <Navigate to="/orders/success" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout/success"
            element={
              <ProtectedRoute>
                <Navigate to="/orders/success" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment/success"
            element={
              <ProtectedRoute>
                <Navigate to="/orders/success" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment-success"
            element={
              <ProtectedRoute>
                <Navigate to="/orders/success" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="success"
            element={
              <ProtectedRoute>
                <Navigate to="/orders/success" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="order-success"
            element={
              <ProtectedRoute>
                <Navigate to="/orders/success" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="stripe/success"
            element={
              <ProtectedRoute>
                <Navigate to="/orders/success" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/cancel"
            element={
              <ProtectedRoute>
                <Navigate to="/checkout/payment" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout/address"
            element={
              <ProtectedRoute>
                <CheckoutAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout/shipping"
            element={
              <ProtectedRoute>
                <CheckoutShipping />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout/payment"
            element={
              <ProtectedRoute>
                <CheckoutPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/categories"
            element={
              <ProtectedRoute requireAdmin>
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/products"
            element={
              <ProtectedRoute requireAdmin>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/brands"
            element={
              <ProtectedRoute requireAdmin>
                <AdminBrands />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/orders"
            element={
              <ProtectedRoute requireAdmin>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="order"
            element={
              <ProtectedRoute>
                <Navigate to="/checkout/address" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/likes" element={<Likes />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
