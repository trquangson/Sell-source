import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '@/features/products/api/productsApi';
import { ShoppingCart, ArrowRight, Code, Shield, Zap, CheckCircle, Search, Download, CreditCard, HelpCircle, ChevronDown, Terminal, Cpu, Database } from 'lucide-react';
import siteConfig from '@/config/siteConfig';
import { useTranslation } from 'react-i18next';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-5 text-left bg-surface hover:bg-surface-hover transition-colors focus:outline-none"
      >
        <span className="font-bold text-text-main text-sm">{question}</span>
        <ChevronDown size={18} className={`text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-5 pt-0 text-text-muted leading-relaxed border-t border-border mt-2 text-sm">
          {answer}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await productsApi.getSources();
        setSources((res.data || []).slice(0, 3));
      } catch (error) {
        console.error('Lỗi lấy danh sách', error);
      }
    };
    fetchSources();
  }, []);

  return (
    <div className="font-sans overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 md:pt-32 md:pb-40 border-b border-border overflow-hidden">
        {/* Tech Grid Background (Light theme variant) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary-300/30 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-main mb-6 tracking-tight leading-[1.15]">
              {t('home.hero_title_1')} <br className="hidden md:block" />
              <span className="text-gradient">{t('home.hero_title_2')}</span>
            </h1>
            <p className="text-lg text-text-muted mb-10 max-w-xl leading-relaxed font-medium">
              {t('home.hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 font-mono text-sm">
              <Link to="/products" className="btn-primary py-3.5 px-8 flex items-center justify-center gap-2 hover:-translate-y-1 shadow-md hover:shadow-lg">
                <Terminal size={18} />
                {t('home.explore_btn')}
              </Link>
              <Link to="/register" className="bg-white hover:bg-surface-hover text-text-main border border-border py-3.5 px-8 rounded-xl font-bold transition-all flex items-center justify-center hover:-translate-y-1 shadow-sm">
                {t('header.register')}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs font-mono font-bold text-text-muted">
              <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> {t('home.malware_free')}</div>
              <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> {t('home.auto_deploy')}</div>
              <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-500" /> {t('home.support_247')}</div>
            </div>
          </div>

          <div className="relative hidden md:block z-10 animate-fade-in-up animation-delay-200 perspective-1000">
            {/* Authentic Terminal Mockup */}
            <div className="relative rounded-xl bg-[#0f172a] shadow-2xl border border-slate-700 overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700">
              <div className="h-9 bg-[#1e293b] flex items-center px-4 gap-2 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                <div className="mx-auto text-slate-400 text-xs font-mono">bash — code247</div>
              </div>
              <div className="p-6 h-80 flex flex-col gap-3 font-mono text-sm leading-relaxed overflow-hidden">
                <div><span className="text-emerald-400">➜</span> <span className="text-primary-400">~</span> <span className="text-slate-100">git clone https://code247.vn/repo/awesome-app.git</span></div>
                <div className="text-slate-400">Cloning into 'awesome-app'...<br />remote: Enumerating objects: 142, done.<br />remote: Counting objects: 100% (142/142), done.<br />remote: Compressing objects: 100% (98/98), done.<br />Receiving objects: 100% (142/142), 1.2 MiB | 4.2 MiB/s, done.</div>
                <div className="mt-2"><span className="text-emerald-400">➜</span> <span className="text-primary-400">~</span> <span className="text-slate-100">cd awesome-app && npm install</span></div>
                <div className="text-slate-400">added 412 packages in 4s</div>
                <div className="mt-2"><span className="text-emerald-400">➜</span> <span className="text-primary-400">awesome-app</span> <span className="text-slate-100">npm run dev</span></div>
                <div className="text-primary-400">  VITE v5.0.0  ready in 320 ms</div>
                <div className="text-slate-400">  ➜  Local:   <span className="text-primary-400 hover:underline cursor-pointer">http://localhost:5173/</span></div>
                <div className="text-slate-400 mt-4 flex items-center gap-1">wait for connection <span className="w-2 h-4 bg-slate-400 animate-pulse inline-block"></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface border-b border-border relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-text-main mb-4 tracking-tight">{t('home.features_title')}</h2>
            <p className="text-text-muted text-lg font-medium">{t('home.features_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-border shadow-sm p-8 rounded-2xl hover:-translate-y-2 hover:shadow-md transition-all duration-300 animate-fade-in-up group">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-3">{t('home.f1_title')}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{t('home.f1_desc')}</p>
            </div>
            <div className="bg-white border border-border shadow-sm p-8 rounded-2xl hover:-translate-y-2 hover:shadow-md transition-all duration-300 animate-fade-in-up animation-delay-100 group">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-3">{t('home.f2_title')}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{t('home.f2_desc')}</p>
            </div>
            <div className="bg-white border border-border shadow-sm p-8 rounded-2xl hover:-translate-y-2 hover:shadow-md transition-all duration-300 animate-fade-in-up animation-delay-200 group">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-3">{t('home.f3_title')}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{t('home.f3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid - Featured */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in-up gap-4">
            <div>
              <div className="text-primary-600 font-mono text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Database size={14} /> {t('home.trending_title')}
              </div>
              <h2 className="text-3xl font-extrabold text-text-main tracking-tight">{t('home.trending_subtitle')}</h2>
            </div>
            <Link to="/products" className="text-text-muted font-mono text-sm font-bold hover:text-primary-600 flex items-center gap-2 transition-colors">
              {t('product.all')} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sources.length === 0 ? (
              <div className="col-span-full text-center py-16 text-text-muted bg-surface rounded-2xl border border-border shadow-sm animate-fade-in font-mono text-sm">
                {t('product.no_products')}
              </div>
            ) : (
              sources.map((source, index) => (
                <div
                  key={source._id}
                  className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden group hover:shadow-lg hover:border-primary-400 transition-all duration-300 flex flex-col h-full animate-fade-in-up relative"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="aspect-[16/9] bg-surface-hover overflow-hidden relative border-b border-border">
                    <img
                      src={source.thumbnail ? `${siteConfig.assetBaseUrl}${source.thumbnail}` : 'https://via.placeholder.com/600x400?text=No+Image'}
                      alt={source.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-primary-600 border border-primary-200 uppercase tracking-wider shadow-sm">
                      {source.category ? t(`categories.${source.category}`) : t('common.package')}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                        {source.title}
                      </h3>
                      <p className="text-sm text-text-muted line-clamp-2 leading-relaxed font-medium">
                        {source.description}
                      </p>
                    </div>

                    <div className="flex items-end justify-between pt-4 border-t border-border mt-auto">
                      <div>
                        <p className="text-[10px] text-text-muted font-mono font-bold uppercase tracking-widest mb-1">{t('detail.license_fee')}</p>
                        <p className="text-xl font-extrabold text-primary-600 font-mono leading-none">
                          {source.price.toLocaleString()}<span className="text-sm font-semibold ml-0.5">đ</span>
                        </p>
                      </div>
                      <Link
                        to={`/product/${source._id}`}
                        className="w-10 h-10 rounded-lg bg-primary-50 group-hover:bg-primary-600 text-primary-600 group-hover:text-white transition-all border border-primary-100 group-hover:border-primary-600 flex items-center justify-center"
                        title={t('product.view_details')}
                      >
                        <ShoppingCart size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-text-main mb-4 tracking-tight">{t('home.deployment_title')}</h2>
            <p className="text-text-muted text-lg font-medium">{t('home.deployment_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[1px] bg-border border-dashed -z-10"></div>

            {[
              { icon: Search, step: '01', title: t('home.step1_title'), desc: t('home.step1_desc') },
              { icon: CreditCard, step: '02', title: t('home.step2_title'), desc: t('home.step2_desc') },
              { icon: ShoppingCart, step: '03', title: t('home.step3_title'), desc: t('home.step3_desc') },
              { icon: Download, step: '04', title: t('home.step4_title'), desc: t('home.step4_desc') },
            ].map((step, idx) => (
              <div key={idx} className="relative text-center animate-fade-in-up group" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="w-16 h-16 mx-auto bg-white rounded-xl border border-border shadow-sm flex items-center justify-center mb-6 relative z-10 group-hover:border-primary-400 group-hover:shadow-md transition-all">
                  <div className="text-primary-600">
                    <step.icon size={24} />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-slate-800 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-base font-bold text-text-main mb-2">{step.title}</h3>
                <p className="text-text-muted text-sm px-4 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="text-primary-600 font-mono text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <Cpu size={14} /> {t('home.knowledge_base')}
            </div>
            <h2 className="text-3xl font-extrabold text-text-main mb-4 tracking-tight">{t('home.faq_title')}</h2>
          </div>

          <div className="space-y-3 animate-fade-in-up">
            <FAQItem
              question={t('home.faq1_q')}
              answer={t('home.faq1_a')}
            />
            <FAQItem
              question={t('home.faq2_q')}
              answer={t('home.faq2_a')}
            />
            <FAQItem
              question={t('home.faq3_q')}
              answer={t('home.faq3_a')}
            />
            <FAQItem
              question={t('home.faq4_q')}
              answer={t('home.faq4_a')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

