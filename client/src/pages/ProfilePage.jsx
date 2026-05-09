import React, { useState, useEffect } from 'react';
import { authApi } from '@/features/auth/api/authApi';
import { Shield, Wallet, Mail, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '@/shared/components/Toast';
import ProfileForm from '@/features/user/components/ProfileForm';
import PasswordForm from '@/features/user/components/PasswordForm';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    authApi.getMe()
      .then(res => {
        setUser(res.user);
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleUpdateSuccess = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading || !user) {
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
          
          {/* Cột trái: Thông tin tĩnh */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
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
            <ProfileForm initialFullName={user.fullName} onUpdateSuccess={handleUpdateSuccess} showToast={showToast} />
            <PasswordForm showToast={showToast} />
          </div>
        </div>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
    </div>
  );
};

export default ProfilePage;
