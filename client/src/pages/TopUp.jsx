import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '@/shared/api/axiosClient';
import { Copy, CheckCheck, ArrowDownCircle, Wallet, Clock, ExternalLink } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const BANK_CODES = {
  'MB Bank': 'MB',
  'VPBank': 'VPB',
  'TPBank': 'TPB',
  'Techcombank': 'TCB',
  'Vietcombank': 'VCB',
  'BIDV': 'BIDV',
  'VietinBank': 'CTG',
};

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000, 1000000];

const TopUp = () => {
  const [amount, setAmount] = useState('');
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const { config } = useSite();
  const { bankName, accountNumber, accountHolder, transferPrefix } = config.payment;
  const bankCode = BANK_CODES[bankName] || 'MB';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, histRes] = await Promise.all([
          axiosClient.get('/auth/me'),
          axiosClient.get('/purchases/history?type=DEPOSIT&page=1')
        ]);
        setUser(userRes.user);
        setHistory(histRes.data?.transactions || []);
      } catch { /* silent */ }
      finally { setHistoryLoading(false); }
    };
    fetchData();
  }, []);

  const transferContent = user ? `${transferPrefix} ${user.username}` : `${transferPrefix} username`;
  const qrUrl = `https://qr.sepay.vn/img?bank=${bankCode}&acc=${accountNumber}&template=compact${amount ? `&amount=${amount}` : ''}&des=${encodeURIComponent(transferContent)}`;

  const copyToClipboard = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="min-h-screen py-6 md:py-8 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">

        <div className="mb-5 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Nạp tiền vào tài khoản</h1>
          <p className="text-slate-500 mt-1 text-sm">Chuyển khoản ngân hàng - số dư được cộng tự động sau vài giây.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* === Cột trái: Chọn số tiền + QR === */}
          <div className="space-y-4">

            {/* Quick amounts */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Chọn hoặc nhập số tiền</label>
              {/* Trên mobile: 3 cột, desktop: flex wrap */}
              <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2 mb-3">
                {QUICK_AMOUNTS.map(q => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium border transition-colors text-center ${
                      amount === String(q)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'
                    }`}
                  >
                    {q.toLocaleString()}đ
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Nhập số tiền khác..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
              />
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm text-center">
              <p className="text-sm font-semibold text-slate-600 mb-3">Quét QR để chuyển khoản</p>
              <div className="inline-block p-3 bg-white rounded-xl border border-slate-200 shadow-inner">
                <img
                  src={qrUrl}
                  alt="QR Chuyển khoản"
                  className="w-40 h-40 md:w-44 md:h-44 object-contain"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">QR cập nhật theo số tiền bạn nhập</p>
            </div>

          </div>

          {/* === Cột phải: Thông tin CK + Lưu ý === */}
          <div className="space-y-4">

            {/* Thông tin tài khoản */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Wallet size={16} className="text-primary-600" /> Thông tin chuyển khoản
              </h2>

              {[
                { label: 'Ngân hàng', value: bankName, key: 'bank' },
                { label: 'Số tài khoản', value: accountNumber, key: 'acc' },
                { label: 'Chủ tài khoản', value: accountHolder, key: 'holder' },
                { label: 'Nội dung CK', value: transferContent, key: 'content', highlight: true },
              ].map(({ label, value, key, highlight }) => (
                <div key={key} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className={`text-sm font-semibold mt-0.5 break-all ${highlight ? 'text-primary-600 font-mono' : 'text-slate-800'}`}>{value}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(value, key)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0"
                    title="Sao chép"
                  >
                    {copied === key ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              ))}

              {amount && (
                <div className="mt-3 flex items-center justify-between py-2.5 border-t border-slate-200 gap-2">
                  <div>
                    <p className="text-xs text-slate-400">Số tiền</p>
                    <p className="text-sm font-bold text-primary-600">{Number(amount).toLocaleString()}đ</p>
                  </div>
                  <button onClick={() => copyToClipboard(amount, 'amount')} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0">
                    {copied === 'amount' ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              )}
            </div>

            {/* Lưu ý */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-sm font-bold text-amber-800 mb-2">⚠️ Quan trọng</p>
              <ul className="text-xs text-amber-700 space-y-1.5">
                <li>• Nội dung chuyển khoản phải ghi đúng <span className="font-mono font-bold break-all">{transferContent}</span></li>
                <li>• Số dư được cộng tự động trong vòng 30 giây sau khi chuyển khoản thành công.</li>
                <li>• Mỗi giao dịch được xử lý 1 lần duy nhất - không chuyển trùng.</li>
              </ul>
            </div>

          </div>
        </div>

        {/* === Lịch sử nạp tiền === */}
        <div className="mt-6 md:mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-primary-600" /> Lịch sử nạp tiền
            </h2>
            <Link to="/history/purchase" className="text-sm text-primary-600 hover:underline flex items-center gap-1 flex-shrink-0">
              <span className="hidden sm:inline">Lịch sử mua hàng</span>
              <span className="sm:hidden">Mua hàng</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {historyLoading ? (
              <p className="p-6 text-center text-slate-500 text-sm">Đang tải...</p>
            ) : history.length === 0 ? (
              <p className="p-6 text-center text-slate-500 text-sm">Chưa có giao dịch nào.</p>
            ) : (
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
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TopUp;
