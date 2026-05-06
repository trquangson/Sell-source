import React from 'react';
import { DollarSign, FileCode2, Users, ShoppingCart } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { name: 'Tổng doanh thu', value: '15,400,000đ', icon: <DollarSign size={24} className="text-green-600" />, bg: 'bg-green-100' },
    { name: 'Sản phẩm', value: '24', icon: <FileCode2 size={24} className="text-blue-600" />, bg: 'bg-blue-100' },
    { name: 'Người dùng', value: '156', icon: <Users size={24} className="text-purple-600" />, bg: 'bg-purple-100' },
    { name: 'Đơn hàng mới', value: '8', icon: <ShoppingCart size={24} className="text-orange-600" />, bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hoạt động gần đây</h3>
        <p className="text-slate-500 text-sm">Chưa có dữ liệu thống kê.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
