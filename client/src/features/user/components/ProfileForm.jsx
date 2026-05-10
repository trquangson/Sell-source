import React, { useState, useEffect } from 'react';
import { userApi } from '@/features/user/api/userApi';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProfileForm = ({ initialFullName, onUpdateSuccess, showToast }) => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState(initialFullName || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    setFullName(initialFullName || '');
  }, [initialFullName]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return showToast(t('profile.empty_name_error', 'Vui lòng nhập tên hiển thị'), 'error');
    
    setUpdatingProfile(true);
    try {
      const res = await userApi.updateProfile({ fullName });
      onUpdateSuccess(res.user);
      showToast(t('profile.update_success', 'Cập nhật thông tin thành công!'));
    } catch (err) {
      showToast(err.message || t('profile.update_error', 'Lỗi cập nhật'), 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 border border-border shadow-sm">
      <h3 className="text-sm font-bold text-text-main mb-6 border-b border-border pb-4 font-mono uppercase tracking-widest">
        {t('profile.basic_data', 'Basic Profile Data')}
      </h3>

      <form onSubmit={handleUpdateProfile} className="max-w-md space-y-5">
        <div>
          <label className="block text-xs font-mono font-bold text-text-muted mb-2 uppercase tracking-wider">{t('profile.display_name', 'Display Name')}</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-text-main font-mono text-sm shadow-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={updatingProfile}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-50 hover:bg-primary-600 border border-primary-100 hover:border-primary-600 text-primary-600 hover:text-white rounded-lg font-bold font-mono transition-colors disabled:opacity-70 w-full md:w-auto text-sm shadow-sm"
          >
            {updatingProfile ? <Loader2 size={16} className="animate-spin" /> : t('profile.save_config', 'Save configuration')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
