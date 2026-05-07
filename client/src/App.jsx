import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSources from './pages/admin/AdminSources';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCoupons from './pages/admin/AdminCoupons';
import ScrollToTop from './components/ScrollToTop';
import FloatingActions from './components/FloatingActions';
import TopUp from './pages/TopUp';
import PurchaseHistory from './pages/PurchaseHistory';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <FloatingActions />
      <Routes>
        {/* Auth Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Public Routes với Header/Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/topup" element={<TopUp />} />
          <Route path="/history/purchase" element={<PurchaseHistory />} />
        </Route>

        {/* Admin Routes (Được bảo vệ) */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="sources" element={<AdminSources />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="coupons" element={<AdminCoupons />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
