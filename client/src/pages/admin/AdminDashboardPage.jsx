import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/features/admin/api/adminApi';
import {
  ArrowDownCircle, ArrowUpCircle, BarChart2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import siteConfig from '../../config/siteConfig';
import DashboardStats from '@/features/admin/components/DashboardStats';

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ';



const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(res => setData(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);



  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <DashboardStats data={data} loading={loading} />

      {/* Biểu đồ doanh thu 7 ngày */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={20} className="text-primary-600" />
          <h3 className="text-base font-bold text-slate-800">Doanh thu 7 ngày qua</h3>
        </div>
        <div className="h-72 w-full">
          {loading ? (
            <div className="w-full h-full bg-slate-100 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${val / 1000}k` : val}
                />
                <Tooltip 
                  formatter={(value) => [fmt(value), 'Doanh thu']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Giao dịch gần nhất */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">10 giao dịch gần nhất</h3>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <th className="px-5 py-3 text-left font-semibold">User</th>
                    <th className="px-5 py-3 text-left font-semibold">Loại</th>
                    <th className="px-5 py-3 text-left font-semibold hidden sm:table-cell">Mô tả</th>
                    <th className="px-5 py-3 text-right font-semibold">Số tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data?.recentTransactions || []).map(tx => (
                    <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-800 truncate max-w-[120px]">
                        {tx.userId?.username || 'N/A'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                          {tx.type === 'DEPOSIT'
                            ? <><ArrowDownCircle size={11} /> Nạp</>
                            : <><ArrowUpCircle size={11} /> Mua</>
                          }
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500 truncate max-w-[180px] hidden sm:table-cell">
                        {tx.sourceId?.title || tx.description}
                      </td>
                      <td className={`px-5 py-3 text-right font-bold ${tx.type === 'DEPOSIT' ? 'text-blue-600' : 'text-green-600'}`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}{fmt(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data?.recentTransactions?.length && (
                <p className="text-center text-slate-400 text-sm py-8">Chưa có giao dịch nào.</p>
              )}
            </div>
          )}
        </div>

        {/* Top sản phẩm */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">Top 5 bán chạy</h3>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(data?.topProducts || []).map((p, idx) => (
                <div key={p._id} className="flex items-center gap-3 px-5 py-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {idx + 1}
                  </span>
                  {p.thumbnail && (
                    <img src={`${siteConfig.assetBaseUrl}${p.thumbnail}`} alt={p.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                    <p className="text-xs text-slate-400">{p.purchaseCount} lượt mua</p>
                  </div>
                </div>
              ))}
              {!data?.topProducts?.length && (
                <p className="text-center text-slate-400 text-sm py-8">Chưa có dữ liệu.</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
