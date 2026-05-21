import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import Home from '@/pages/Home';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import AdminRoute from '@/features/auth/components/AdminRoute';
import AdminLayout from '@/app/layouts/AdminLayout';
import PublicLayout from '@/app/layouts/PublicLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminSourcesPage from '@/pages/admin/AdminSourcesPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminCouponsPage from '@/pages/admin/AdminCouponsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AdminNotificationsPage from '@/pages/admin/AdminNotificationsPage';
import Contact from '@/pages/Contact';
import ProfilePage from '@/pages/ProfilePage';
import ScrollToTop from '@/shared/components/ScrollToTop';
import FloatingActions from '@/shared/components/FloatingActions';
import UserProfilePage from '@/pages/UserProfilePage';
import TopUpPage from '@/pages/TopUpPage';
import PurchaseHistoryPage from '@/pages/PurchaseHistoryPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ForumPage from '@/pages/ForumPage';
import ForumDetailPage from '@/pages/ForumDetailPage';
import ForumCreatePage from '@/pages/ForumCreatePage';
import ForumEditPage from '@/pages/ForumEditPage';
import ForumMyPostsPage from '@/pages/ForumMyPostsPage';
import AdminForumPage from '@/pages/admin/AdminForumPage';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';

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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
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
          <Route path="/user/:id" element={<UserProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/:id" element={<ForumDetailPage />} />
          <Route path="/forum/create" element={<ProtectedRoute><ForumCreatePage /></ProtectedRoute>} />
          <Route path="/forum/edit/:id" element={<ProtectedRoute><ForumEditPage /></ProtectedRoute>} />
          <Route path="/forum/my-posts" element={<ProtectedRoute><ForumMyPostsPage /></ProtectedRoute>} />
        </Route>

        {/* Admin Routes (Được bảo vệ) */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="sources" element={<AdminSourcesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="forum" element={<AdminForumPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
