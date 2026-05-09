import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/features/auth/api/authApi';
import { Loader2, Code2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
      const response = await authApi.login(formData);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Tài khoản hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
            <Code2 className="text-white" size={24} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Đăng nhập hệ thống
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Truy cập nền tảng SellSource của bạn
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card px-4 py-8 sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Mật khẩu
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                    Quên mật khẩu?
                  </a>
                </div>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 cursor-pointer">
                  Ghi nhớ đăng nhập
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="text-center text-sm text-slate-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Tạo tài khoản mới
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
