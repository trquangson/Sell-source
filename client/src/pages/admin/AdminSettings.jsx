import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '@/shared/api/axiosClient';
import { Save, Loader2, CheckCircle2, Globe, CreditCard, Eye, EyeOff } from 'lucide-react';

const SECTIONS = [
  {
    id: 'site',
    label: 'Thông tin Website',
    icon: <Globe size={18} />,
    fields: [
      { key: 'site.name', label: 'Tên website', type: 'text', placeholder: 'Code247' },
      { key: 'site.description', label: 'Mô tả ngắn', type: 'textarea', placeholder: 'Mô tả hiển thị trên trang chủ...' },
      { key: 'site.favicon', label: 'Favicon URL', type: 'text', placeholder: 'https://example.com/favicon.ico' },
      { key: 'site.email', label: 'Email hỗ trợ', type: 'email', placeholder: 'support@example.com' },
      { key: 'site.phone', label: 'Số điện thoại', type: 'text', placeholder: '0987654321' },
      { key: 'site.zalo', label: 'Link Zalo', type: 'text', placeholder: 'https://zalo.me/...' },
      { key: 'site.facebook', label: 'Link Facebook', type: 'text', placeholder: 'https://facebook.com/...' },
    ]
  },
  {
    id: 'payment',
    label: 'Thông tin thanh toán',
    icon: <CreditCard size={18} />,
    fields: [
      { key: 'payment.bankName', label: 'Tên ngân hàng', type: 'text', placeholder: 'TPBank' },
      { key: 'payment.accountNumber', label: 'Số tài khoản', type: 'text', placeholder: '10002022890' },
      { key: 'payment.accountHolder', label: 'Chủ tài khoản', type: 'text', placeholder: 'NGUYEN VAN A' },
      { key: 'payment.transferPrefix', label: 'Prefix nội dung CK', type: 'text', placeholder: 'naptien' },
      { key: 'payment.sepayWebhookApiKey', label: 'SePay Webhook API Key', type: 'password', placeholder: 'Để trống = giữ nguyên key cũ' },
    ]
  }
];

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl animate-fade-in">
      <CheckCircle2 size={18} className="text-green-400" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const AdminSettings = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [activeTab, setActiveTab] = useState(SECTIONS[0].id);

  useEffect(() => {
    axiosClient.get('/admin/settings').then(res => {
      const { 'payment.sepayWebhookApiKey.set': keySet, ...rest } = res.data;
      setFormData(rest);
      setApiKeySet(!!keySet);
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSection = async (sectionId, fields) => {
    setSaving(prev => ({ ...prev, [sectionId]: true }));
    try {
      const payload = {};
      fields.forEach(f => {
        // Bỏ qua password field nếu để trống (giữ nguyên key cũ)
        if (f.type === 'password' && !formData[f.key]) return;
        payload[f.key] = formData[f.key] ?? '';
      });

      await axiosClient.put('/admin/settings', payload);
      setToast('Đã lưu cài đặt thành công!');
      // Refresh API key status
      if (sectionId === 'payment' && payload['payment.sepayWebhookApiKey']) {
        setApiKeySet(true);
        setFormData(prev => ({ ...prev, 'payment.sepayWebhookApiKey': '' }));
      }
    } catch (err) {
      setToast(err.message || 'Lưu thất bại');
    } finally {
      setSaving(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <Loader2 size={28} className="animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {SECTIONS.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === section.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>

      {SECTIONS.map(section => section.id === activeTab && (
        <div key={section.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          {/* Section header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="text-primary-600">{section.icon}</span>
            <h2 className="text-base font-bold text-slate-800">{section.label}</h2>
          </div>

          {/* Fields */}
          <div className="p-6 space-y-4">
            {section.fields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {field.label}
                  {field.type === 'password' && apiKeySet && (
                    <span className="ml-2 text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Đã cấu hình</span>
                  )}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={formData[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="input-field resize-none"
                  />
                ) : field.type === 'password' ? (
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={formData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="input-field pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="input-field"
                  />
                )}

                {field.key === 'site.favicon' && formData[field.key] && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={formData[field.key]} alt="favicon preview" className="w-6 h-6 rounded" onError={e => e.target.style.display = 'none'} />
                    <span className="text-xs text-slate-400">Preview</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save button */}
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => handleSaveSection(section.id, section.fields)}
              disabled={saving[section.id]}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {saving[section.id]
                ? <><Loader2 size={16} className="animate-spin" /> Đang lưu...</>
                : <><Save size={16} /> Lưu {section.label}</>
              }
            </button>
          </div>
        </div>
      ))}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
};

export default AdminSettings;
