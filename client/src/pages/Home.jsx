import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API /me để xác thực phiên qua Cookie
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get('/auth/me');
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user)); // Cập nhật lại local cache
      } catch (error) {
        // Token hết hạn hoặc không hợp lệ -> Xoá rác và đẩy về login
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    } finally {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold text-primary-600">SellSource</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
              <p className="text-xs text-slate-500">Số dư: {user.balance?.toLocaleString()} VNĐ</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Xin chào, {user.username}!</h3>
            <p className="text-slate-600 text-sm">
              Phiên làm việc của bạn đang được bảo vệ an toàn bằng JWT HttpOnly Cookie.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">Email: {user.email}</p>
              <p className="text-sm text-slate-500">Vai trò: <span className="font-medium text-primary-600">{user.role}</span></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
