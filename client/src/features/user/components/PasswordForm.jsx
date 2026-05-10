import React, { useState } from 'react';
import { userApi } from '@/features/user/api/userApi';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PasswordForm = ({ showToast }) => {
  const { t } = useTranslation();
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [updatingPass, setUpdatingPass] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passForm.oldPassword || !passForm.newPassword) {
      return showToast(t('profile.empty_password_error', 'Vui lòng nhập đủ thông tin'), 'error');
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      return showToast(t('profile.password_mismatch_error', 'Mật khẩu xác nhận không khớp'), 'error');
    }

    setUpdatingPass(true);
    try {
      await userApi.updatePassword({
        oldPassword: passForm.oldPassword,
        newPassword: passForm.newPassword
      });
      showToast(t('profile.password_update_success', 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'));
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => navigate('/login'), 2000); // Logout/redirect
    } catch (err) {
      showToast(err.message || t('profile.password_update_error', 'Lỗi đổi mật khẩu'), 'error');
    } finally {
      setUpdatingPass(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 border border-border shadow-sm">
      <h3 className="text-sm font-bold text-text-main mb-6 border-b border-border pb-4 font-mono uppercase tracking-widest text-red-500">
        {t('profile.security_credentials', 'Security Credentials')}
      </h3>

      <form onSubmit={handleUpdatePassword} className="max-w-md space-y-5">
        <div>
          <label className="block text-xs font-mono font-bold text-text-muted mb-2 uppercase tracking-wider">{t('profile.current_password', 'Current Password')}</label>
          <input
            type="password"
            value={passForm.oldPassword}
            onChange={e => setPassForm(p => ({ ...p, oldPassword: e.target.value }))}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-text-main font-mono text-sm shadow-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-mono font-bold text-text-muted mb-2 uppercase tracking-wider">{t('profile.new_password', 'New Password')}</label>
          <input
            type="password"
            value={passForm.newPassword}
            onChange={e => setPassForm(p => ({ ...p, newPassword: e.target.value }))}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-text-main font-mono text-sm shadow-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-mono font-bold text-text-muted mb-2 uppercase tracking-wider">{t('profile.confirm_password', 'Confirm New Password')}</label>
          <input
            type="password"
            value={passForm.confirmPassword}
            onChange={e => setPassForm(p => ({ ...p, confirmPassword: e.target.value }))}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-text-main font-mono text-sm shadow-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={updatingPass}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 hover:bg-red-600 border border-red-100 hover:border-red-600 text-red-600 hover:text-white rounded-lg font-bold font-mono transition-colors disabled:opacity-70 w-full md:w-auto text-sm shadow-sm"
          >
            {updatingPass ? <Loader2 size={16} className="animate-spin" /> : t('profile.update_credentials', 'Update credentials')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
