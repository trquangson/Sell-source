import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaFacebook } from 'react-icons/fa';
import siteConfig from '../config/siteConfig';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight mb-4 inline-block">{siteConfig.name}</Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2 text-sm">
            {siteConfig.navLinks.map(link => (
              <li key={link.path}><Link to={link.path} className="hover:text-primary-400 transition-colors">{link.name}</Link></li>
            ))}
            {siteConfig.policyLinks.map(link => (
              <li key={link.path}><Link to={link.path} className="hover:text-primary-400 transition-colors">{link.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Kết nối với chúng tôi</h3>
          <div className="flex gap-4">
            <a href={siteConfig.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
              <FaFacebook size={20} />
            </a>
            <a href={siteConfig.socials.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
              <FaTwitter size={20} />
            </a>
            <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
              <FaGithub size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
