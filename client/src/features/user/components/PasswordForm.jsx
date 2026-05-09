import React, { useState } from 'react';
import { userApi } from '@/features/user/api/userApi';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PasswordForm = ({ showToast }) => {
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [updatingPass, setUpdatingPass] = useState(false);
  const navigate = useNavigate();

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
      await userApi.updatePassword({
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

  return (
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
  );
};

export default PasswordForm;
