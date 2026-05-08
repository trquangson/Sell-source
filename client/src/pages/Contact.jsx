import React from 'react';
import { Mail, Phone, Clock, Globe, MessageCircle, ExternalLink } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const Contact = () => {
  const { config } = useSite();

  const contactMethods = [
    {
      icon: <Phone size={24} className="text-primary-600" />,
      title: 'Điện thoại',
      value: config.socials.phone || 'Chưa cập nhật',
      link: config.socials.phone ? `tel:${config.socials.phone}` : null,
      color: 'bg-primary-100',
    },
    {
      icon: <Mail size={24} className="text-rose-600" />,
      title: 'Email hỗ trợ',
      value: config.socials.email || 'Chưa cập nhật',
      link: config.socials.email ? `mailto:${config.socials.email}` : null,
      color: 'bg-rose-100',
    },
    {
      icon: <MessageCircle size={24} className="text-blue-600" />,
      title: 'Zalo',
      value: 'Nhắn tin qua Zalo',
      link: config.socials.zalo || null,
      color: 'bg-blue-100',
    },
    {
      icon: <Globe size={24} className="text-indigo-600" />,
      title: 'Facebook',
      value: 'Fanpage chính thức',
      link: config.socials.facebook || null,
      color: 'bg-indigo-100',
    }
  ];

  return (
    <div className="min-h-screen py-10 md:py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Liên hệ với chúng tôi
          </h1>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
          {contactMethods.map((method, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${method.color}`}>
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-base font-bold text-slate-800 mb-1">{method.title}</h3>
                  {method.link ? (
                    <a
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 font-medium hover:text-primary-600 transition-colors flex items-center gap-1.5"
                    >
                      {method.value}
                      <ExternalLink size={14} className="text-slate-400" />
                    </a>
                  ) : (
                    <p className="text-slate-500 font-medium">{method.value}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Working Hours Card (Minimalist UI) */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Thời gian làm việc</h3>
              <p className="text-slate-500 text-sm">
                Đội ngũ luôn túc trực để hỗ trợ các giao dịch và sự cố kỹ thuật.
              </p>
            </div>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <div className="text-slate-500 font-medium mb-1">Giờ làm việc</div>
              <div className="text-slate-900 font-bold">08:00 - 22:00</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
