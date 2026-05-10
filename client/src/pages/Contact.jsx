import React from 'react';
import { Mail, Phone, Clock, Globe, MessageCircle, ExternalLink } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const { config } = useSite();

  const contactMethods = [
    {
      icon: <Phone size={24} className="text-primary-600" />,
      title: t('contact.phone'),
      value: config.socials.phone || t('contact.not_updated'),
      link: config.socials.phone ? `tel:${config.socials.phone}` : null,
      color: 'bg-primary-100',
    },
    {
      icon: <Mail size={24} className="text-rose-600" />,
      title: t('contact.email'),
      value: config.socials.email || t('contact.not_updated'),
      link: config.socials.email ? `mailto:${config.socials.email}` : null,
      color: 'bg-rose-100',
    },
    {
      icon: <MessageCircle size={24} className="text-blue-600" />,
      title: t('contact.zalo'),
      value: t('contact.zalo_value'),
      link: config.socials.zalo || null,
      color: 'bg-blue-100',
    },
    {
      icon: <Globe size={24} className="text-indigo-600" />,
      title: t('contact.facebook'),
      value: t('contact.facebook_value'),
      link: config.socials.facebook || null,
      color: 'bg-indigo-100',
    }
  ];

  return (
    <div className="min-h-screen py-16 bg-slate-50 relative overflow-hidden font-sans">
      {/* Subtle modern background decoration */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary-50/50 to-slate-50 pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100/50 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {t('contact.title')}
          </h1>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contactMethods.map((method, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] opacity-20 transition-transform group-hover:scale-110 ${method.color}`}></div>
              <div className="flex items-start gap-5 relative z-10">
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

        {/* Working Hours Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-transparent pointer-events-none"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{t('contact.working_hours')}</h3>
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-3 rounded-xl border border-slate-100 relative z-10 text-center md:text-left">
            <div className="text-slate-500 text-xs font-medium mb-1">{t('contact.hours_label')}</div>
            <div className="text-slate-900 font-bold">{t('contact.hours_value')}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
