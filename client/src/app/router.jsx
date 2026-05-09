import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import Home from '@/pages/Home';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
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
import TopUpPage from '@/pages/TopUpPage';
import PurchaseHistoryPage from '@/pages/PurchaseHistoryPage';

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
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/topup" element={<TopUpPage />} />
          <Route path="/history/purchase" element={<PurchaseHistoryPage />} />
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
