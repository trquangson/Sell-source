import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import AdminRoute from '@/features/auth/components/AdminRoute';
import AdminLayout from '@/app/layouts/AdminLayout';
import PublicLayout from '@/app/layouts/PublicLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminSources from '@/pages/admin/AdminSources';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminCoupons from '@/pages/admin/AdminCoupons';
import AdminSettings from '@/pages/admin/AdminSettings';
import Contact from '@/pages/Contact';
import ProfilePage from '@/pages/ProfilePage';
import ScrollToTop from '@/shared/components/ScrollToTop';
import FloatingActions from '@/shared/components/FloatingActions';
import TopUp from '@/pages/TopUp';
import PurchaseHistory from '@/pages/PurchaseHistory';

export default function AppRouter() {
  return (
    <Router>
      <ScrollToTop />
      <FloatingActions />
      <Routes>
        {/* Auth Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Public Routes với Header/Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/topup" element={<TopUp />} />
          <Route path="/history/purchase" element={<PurchaseHistory />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Routes (Được bảo vệ) */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="sources" element={<AdminSources />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
