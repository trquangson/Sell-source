import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaFacebook } from 'react-icons/fa';
import { useSite } from '@/context/SiteContext';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const { config } = useSite();

  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800 font-mono relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-2xl font-bold text-primary-400 tracking-tight mb-4 inline-block hover:text-primary-300 transition-colors">
            &gt;_{config.name}
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6 font-medium">
            {t('site.description')}
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-800/50 border border-slate-700 w-max px-3 py-1.5 rounded-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t('footer.all_systems_operational')}
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6">{t('footer.quick_links')}</h3>
          <ul className="space-y-3 text-sm font-medium text-slate-400">
            {config.navLinks.map(link => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500/50">/</span> {link.i18nKey ? t(link.i18nKey) : link.name}
                </Link>
              </li>
            ))}
            {config.policyLinks.map(link => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="text-primary-500/50">/</span> {link.i18nKey ? t(link.i18nKey) : link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6">{t('footer.connect')}</h3>
          <div className="flex gap-3">
            {config.socials.facebook && (
              <a href={config.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-primary-500/10 hover:text-primary-400 hover:border-primary-500/50 transition-all text-slate-400">
                <FaFacebook size={18} />
              </a>
            )}
            {config.socials.twitter && (
              <a href={config.socials.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-primary-500/10 hover:text-primary-400 hover:border-primary-500/50 transition-all text-slate-400">
                <FaTwitter size={18} />
              </a>
            )}
            {config.socials.github && (
              <a href={config.socials.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-primary-500/10 hover:text-primary-400 hover:border-primary-500/50 transition-all text-slate-400">
                <FaGithub size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-xs text-center text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4 font-bold">
        <span>&copy; {new Date().getFullYear()} {config.name}. {t('footer.all_rights_reserved')}</span>
      </div>
    </footer>
  );
};

export default Footer;
