import { Route, Routes } from 'react-router-dom';
import AddCategory from '../pages/admin/category/add-category';
import CategoryManagement from '../pages/admin/category/category-management';
import Dashboard from '../pages/admin/dashboard';

import Order from '../pages/admin/order/order-management';
import AddProduct from '../pages/admin/product/add-product';
import AddVariant from '../pages/admin/product/add-variant';
import ProductManagement from '../pages/admin/product/product-management';

import UserManagement from '../pages/admin/user/user-management';
import ForgotPassword from '../pages/auth/forgot-password';
import Login from '../pages/auth/login';
import Registration from '../pages/auth/registration';
import ResetPassword from '../pages/auth/reset-password';
import VerifyOTP from '../pages/auth/verify-otp';
import Cart from '../pages/customer/cart/cart';
import Checkout from '../pages/customer/checkout/checkout';
import CheckoutFailed from "../pages/customer/checkout/checkout-failed";
import CheckoutSuccess from '../pages/customer/checkout/checkout-success';
import Home from '../pages/customer/home/home';
import ProductDetail from '../pages/customer/product-detail/product-detail';
import Product from '../pages/customer/product-option/product';
import Profile from '../pages/customer/user/profile';
import ProtectedRoutes from './protected-routes';


import AdminLayout from '../component/admin-layout';


export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      <Route element={<ProtectedRoutes />,<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/order" element={<Order />} />
        <Route path="/admin/category" element={<CategoryManagement />} />
        <Route path="/admin/product" element={<ProductManagement />} />
        <Route path="/admin/user" element={<UserManagement />} />
        <Route path="/admin/add-category" element={<AddCategory />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/add-variant" element={<AddVariant />} />
      </Route>

      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/products" element={<Product />} />
      <Route path="/categories/:category_id/products" element={<Product />} />
      <Route path="/product-details/:product_id" element={<ProductDetail />} />
      <Route path="/carts" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/failed" element={<CheckoutFailed />} />

    </Routes>
  );
}
