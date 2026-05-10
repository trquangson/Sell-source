import React, { useState, useEffect } from 'react';
import { authApi } from '@/features/auth/api/authApi';
import { Shield, Wallet, Mail, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '@/shared/components/Toast';
import ProfileForm from '@/features/user/components/ProfileForm';
import PasswordForm from '@/features/user/components/PasswordForm';
import UserDashboardLayout from '@/shared/components/UserDashboardLayout';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
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
    <UserDashboardLayout title={t('profile.title')} subtitle={t('profile.subtitle')}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Static Info */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-border shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-2xl group-hover:bg-primary-200 transition-all"></div>
            
            <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-surface-hover flex items-center justify-center text-3xl font-mono font-bold text-primary-600 border border-primary-200 shadow-sm relative z-10">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-xl font-bold text-text-main relative z-10">{user.fullName}</h2>
            <p className="text-sm text-text-muted mt-1 font-medium relative z-10">@{user.username}</p>
            
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-border rounded font-mono text-xs font-bold text-text-main shadow-sm relative z-10">
              <Shield size={14} className={user.role === 'admin' ? 'text-emerald-500' : 'text-primary-600'} />
              {user.role === 'admin' ? 'ROOT' : 'USER'}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-border shadow-sm space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1.5 font-bold"><Wallet size={12}/> {t('profile.available_balance')}</p>
              <p className="text-lg font-bold text-emerald-600 font-mono">{user.balance?.toLocaleString()}đ</p>
            </div>
            <div className="h-px bg-border" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1.5 font-bold"><Mail size={12}/> {t('profile.email_address')}</p>
              <p className="text-sm font-bold text-text-main truncate font-mono">{user.email}</p>
            </div>
            <div className="h-px bg-border" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1.5 font-bold"><Calendar size={12}/> {t('profile.account_created')}</p>
              <p className="text-sm font-bold text-text-main font-mono">
                {new Date(user.createdAt).toLocaleDateString('en-US')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="xl:col-span-2 space-y-6">
          <ProfileForm initialFullName={user.fullName} onUpdateSuccess={handleUpdateSuccess} showToast={showToast} />
          <PasswordForm showToast={showToast} />
        </div>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
    </UserDashboardLayout>
  );
};

export default ProfilePage;
