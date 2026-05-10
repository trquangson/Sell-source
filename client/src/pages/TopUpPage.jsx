import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/features/auth/api/authApi';
import { billingApi } from '@/features/billing/api/billingApi';
import { Copy, CheckCheck, Wallet, Clock, ExternalLink } from 'lucide-react';
import { useSite } from '@/context/SiteContext';
import DepositHistory from '@/features/billing/components/DepositHistory';
import UserDashboardLayout from '@/shared/components/UserDashboardLayout';
import { useTranslation } from 'react-i18next';

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

const TopUpPage = () => {
  const { t } = useTranslation();
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
          authApi.getMe(),
          billingApi.getPurchaseHistory('DEPOSIT', 1)
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
    <UserDashboardLayout title={t('topup.title')} subtitle={t('topup.subtitle')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-3">{t('topup.choose_amount')}</label>
            <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2 mb-3">
              {QUICK_AMOUNTS.map(q => (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold border transition-colors text-center shadow-sm ${
                    amount === String(q)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400 hover:text-primary-600'
                  }`}
                >
                  {q.toLocaleString()}đ
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder={t('topup.enter_other')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-slate-200 rounded-xl text-sm font-mono focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm text-center">
            <p className="text-sm font-bold text-slate-700 mb-3">{t('topup.scan_qr')}</p>
            <div className="inline-block p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <img
                src={qrUrl}
                alt="QR Chuyển khoản"
                className="w-40 h-40 md:w-44 md:h-44 object-contain"
              />
            </div>
            <p className="text-xs text-slate-500 mt-3 font-medium">{t('topup.qr_update_note')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Wallet size={16} className="text-primary-600" /> {t('topup.transfer_info')}
            </h2>

            {[
              { label: t('topup.bank'), value: bankName, key: 'bank' },
              { label: t('topup.account_number'), value: accountNumber, key: 'acc' },
              { label: t('topup.account_holder'), value: accountHolder, key: 'holder' },
              { label: t('topup.content'), value: transferContent, key: 'content', highlight: true },
            ].map(({ label, value, key, highlight }) => (
              <div key={key} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-bold">{label}</p>
                  <p className={`text-sm font-bold mt-0.5 break-all ${highlight ? 'text-primary-600 font-mono text-base' : 'text-slate-800'}`}>{value}</p>
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
                  <p className="text-xs text-slate-500 font-bold">{t('topup.amount_label')}</p>
                  <p className="text-sm font-extrabold text-primary-600">{Number(amount).toLocaleString()}đ</p>
                </div>
                <button onClick={() => copyToClipboard(amount, 'amount')} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0">
                  {copied === 'amount' ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-bold text-amber-800 mb-2">⚠️ {t('topup.important_note')}</p>
            <ul className="text-xs text-amber-700 space-y-1.5 font-medium">
              <li>• {t('topup.note_1')} <span className="font-mono font-bold break-all text-amber-900 bg-amber-100 px-1 rounded">{transferContent}</span></li>
              <li>• {t('topup.note_2')}</li>
              <li>• {t('topup.note_3')}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock size={18} className="text-primary-600" /> {t('topup.deposit_history')}
          </h2>
          <Link to="/history/purchase" className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1 flex-shrink-0 transition-colors">
            <span className="hidden sm:inline">{t('topup.purchase_history')}</span>
            <span className="sm:hidden">{t('topup.purchase_btn')}</span>
            <ExternalLink size={13} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <DepositHistory history={history} loading={historyLoading} />
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default TopUpPage;
