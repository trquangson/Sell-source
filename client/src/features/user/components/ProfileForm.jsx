import React, { useState, useEffect } from 'react';
import { userApi } from '@/features/user/api/userApi';
import { Loader2 } from 'lucide-react';

const ProfileForm = ({ initialFullName, onUpdateSuccess, showToast }) => {
  const [fullName, setFullName] = useState(initialFullName || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    setFullName(initialFullName || '');
  }, [initialFullName]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return showToast('Vui lòng nhập tên hiển thị', 'error');
    
    setUpdatingProfile(true);
    try {
      const res = await userApi.updateProfile({ fullName });
      onUpdateSuccess(res.user);
      showToast('Cập nhật thông tin thành công!');
    } catch (err) {
      showToast(err.message || 'Lỗi cập nhật', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
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
  );
};

export default ProfileForm;
