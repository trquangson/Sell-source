import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/features/auth/api/authApi';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';

const RegisterForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message || t('auth.register.error_msg', 'Đăng ký thất bại, vui lòng kiểm tra lại thông tin!'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await authApi.googleLogin(credentialResponse.credential);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    } catch (err) {
      setError(err.message || t('auth.login.google_error', 'Lỗi đăng nhập Google. Vui lòng thử lại!'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(t('auth.login.google_error', 'Lỗi đăng nhập Google. Vui lòng thử lại!'));
  };

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            {t('auth.register.fullname_label', 'Họ và tên')}
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all shadow-sm"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            {t('auth.register.username_label', 'Tên đăng nhập')}
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all shadow-sm"
            placeholder="nguyenvana"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            {t('auth.register.email_label', 'Địa chỉ Email')}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all shadow-sm"
            placeholder="nguyenvana@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            {t('auth.register.password_label', 'Mật khẩu')}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all shadow-sm"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 flex justify-center items-center text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              t('auth.register.submit', 'Đăng ký tài khoản')
            )}
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                {t('auth.login.or_continue_with', 'Hoặc tiếp tục với')}
              </span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
