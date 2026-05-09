import React from 'react';
import { DollarSign, FileCode2, Users, ShoppingCart, TrendingUp, ArrowDownCircle } from 'lucide-react';

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ';

const StatCard = ({ name, value, icon, colorClass, sub }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-medium text-slate-500 truncate">{name}</p>
      <p className="text-xl font-bold text-slate-900 truncate">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const DashboardStats = ({ data, loading }) => {
  const stats = data ? [
    {
      name: 'Doanh thu hôm nay',
      value: fmt(data.stats.todayRevenue),
      icon: <TrendingUp size={22} className="text-emerald-600" />,
      colorClass: 'bg-emerald-100',
    },
    {
      name: 'Tổng doanh thu',
      value: fmt(data.stats.totalRevenue),
      icon: <DollarSign size={22} className="text-green-600" />,
      colorClass: 'bg-green-100',
      sub: `${data.stats.totalOrders} đơn hàng`,
    },
    {
      name: 'Tổng nạp tiền',
      value: fmt(data.stats.totalDeposit),
      icon: <ArrowDownCircle size={22} className="text-blue-600" />,
      colorClass: 'bg-blue-100',
    },
    {
      name: 'Sản phẩm',
      value: data.stats.totalProducts,
      icon: <FileCode2 size={22} className="text-violet-600" />,
      colorClass: 'bg-violet-100',
    },
    {
      name: 'Người dùng',
      value: data.stats.totalUsers,
      icon: <Users size={22} className="text-orange-600" />,
      colorClass: 'bg-orange-100',
    },
    {
      name: 'Đơn hàng',
      value: data.stats.totalOrders,
      icon: <ShoppingCart size={22} className="text-pink-600" />,
      colorClass: 'bg-pink-100',
    },
  ] : [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse mb-3" />
            <div className="h-3 bg-slate-100 rounded animate-pulse mb-2 w-3/4" />
            <div className="h-5 bg-slate-100 rounded animate-pulse w-1/2" />
          </div>
        ))
        : stats.map((s, i) => <StatCard key={i} {...s} />)
      }
    </div>
  );
};

export default DashboardStats;
