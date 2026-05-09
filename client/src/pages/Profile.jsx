import React, { useState, useEffect } from 'react';
import axiosClient from '@/shared/api/axiosClient';
import { User, Lock, Mail, Shield, Wallet, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl animate-fade-in text-white ${type === 'success' ? 'bg-slate-900' : 'bg-red-500'}`}>
      {type === 'success' && <CheckCircle2 size={18} className="text-green-400" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Profile form
  const [fullName, setFullName] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  
  // Password form
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [updatingPass, setUpdatingPass] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get('/auth/me')
      .then(res => {
        setUser(res.user);
        setFullName(res.user.fullName || '');
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return showToast('Vui lòng nhập tên hiển thị', 'error');
    
    setUpdatingProfile(true);
    try {
      const res = await axiosClient.put('/profile', { fullName });
      setUser(res.user);
      showToast('Cập nhật thông tin thành công!');
    } catch (err) {
      showToast(err.message || 'Lỗi cập nhật', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passForm.oldPassword || !passForm.newPassword) {
      return showToast('Vui lòng nhập đủ thông tin', 'error');
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      return showToast('Mật khẩu xác nhận không khớp', 'error');
    }

    setUpdatingPass(true);
    try {
      await axiosClient.put('/profile/password', {
        oldPassword: passForm.oldPassword,
        newPassword: passForm.newPassword
      });
      showToast('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => navigate('/login'), 2000); // Logout/redirect
    } catch (err) {
      showToast(err.message || 'Lỗi đổi mật khẩu', 'error');
    } finally {
      setUpdatingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Hồ sơ của bạn</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý thông tin tài khoản và bảo mật</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Cột trái: Thông tin tĩnh (Minimalist) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
              {/* Avatar Box */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600 border border-slate-200">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <h2 className="text-lg font-bold text-slate-900">{user.fullName}</h2>
              <p className="text-sm text-slate-500 mt-1">@{user.username}</p>
              
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                <Shield size={14} className={user.role === 'admin' ? 'text-primary-600' : 'text-slate-400'} />
                {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Wallet size={14}/> Số dư khả dụng</p>
                <p className="text-base font-bold text-emerald-600">{user.balance?.toLocaleString()}đ</p>
              </div>
              <div className="h-px bg-slate-100" />
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Mail size={14}/> Email</p>
                <p className="text-sm font-medium text-slate-800 truncate">{user.email}</p>
              </div>
              <div className="h-px bg-slate-100" />
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Calendar size={14}/> Ngày tham gia</p>
                <p className="text-sm font-medium text-slate-800">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>

          {/* Cột phải: Form cập nhật */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Form Profile */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                Thông tin cơ bản
              </h3>

              <form onSubmit={handleUpdateProfile} className="max-w-md space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tên hiển thị</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-800"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70 w-full md:w-auto"
                  >
                    {updatingProfile ? <Loader2 size={18} className="animate-spin" /> : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            </div>

            {/* Form Password */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                Thay đổi mật khẩu
              </h3>

              <form onSubmit={handleUpdatePassword} className="max-w-md space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu cũ</label>
                  <input
                    type="password"
                    value={passForm.oldPassword}
                    onChange={e => setPassForm(p => ({ ...p, oldPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={passForm.newPassword}
                    onChange={e => setPassForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    value={passForm.confirmPassword}
                    onChange={e => setPassForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={updatingPass}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors disabled:opacity-70 w-full md:w-auto"
                  >
                    {updatingPass ? <Loader2 size={18} className="animate-spin" /> : 'Đổi mật khẩu'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
    </div>
  );
};

export default Profile;
