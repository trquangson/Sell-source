import React from 'react';
import { ArrowDownCircle } from 'lucide-react';

const DepositHistory = ({ history, loading }) => {
  if (loading) return <p className="p-6 text-center text-slate-500 text-sm">Đang tải...</p>;
  if (history.length === 0) return <p className="p-6 text-center text-slate-500 text-sm">Chưa có giao dịch nào.</p>;

  return (
    <div className="divide-y divide-slate-100">
      {history.map(tx => (
        <div key={tx._id} className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <ArrowDownCircle size={16} className="text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{tx.description}</p>
              <p className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleString('vi-VN')}</p>
            </div>
          </div>
          <span className="text-green-600 font-bold text-sm flex-shrink-0">+{tx.amount.toLocaleString()}đ</span>
        </div>
      ))}
    </div>
  );
};

export default DepositHistory;
