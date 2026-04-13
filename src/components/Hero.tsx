import React from 'react';
import { ArrowRight, ChevronRight, ShieldCheck, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 md:pt-44 lg:pt-52 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-light">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-8 text-dark">
              {t.hero.title.split('{gradient}')[0]}
              <span className="text-gradient">{t.hero.gradient}</span>
              {t.hero.title.split('{gradient}')[1]}
            </h1>
            
            <p className="text-lg text-dark/60 max-w-lg mb-10 leading-relaxed">
              {t.hero.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="group px-8 py-4 rounded-full bg-primary text-white font-bold flex items-center gap-2 hover:bg-dark"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#portfolio"
                className="px-8 py-4 rounded-full bg-white border border-black/5 shadow-sm font-bold flex items-center gap-2 hover:bg-light"
              >
                {t.hero.ctaSecondary}
                <ChevronRight className="w-5 h-5" />
              </a>
              <Link
                to="/malta-services"
                className="px-8 py-4 rounded-full bg-secondary text-white font-bold flex items-center gap-2 hover:bg-dark transition-all"
              >
                <MapPin className="w-5 h-5" />
                {t.hero.ctaMalta}
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-sm font-bold text-dark">{t.hero.badge1}</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                <Award className="w-6 h-6 text-primary" />
                <span className="text-sm font-bold text-dark">{t.hero.badge2}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden border border-black/5 shadow-2xl shadow-primary/5">
              <img
                src="https://images.unsplash.com/photo-1635424710928-0544e8512eae?auto=format&fit=crop&q=80&w=1000"
                alt="Modern tetőfedés"
                className="w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-6 glass rounded-2xl">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{t.hero.projectLabel}</p>
                    <h3 className="text-xl font-bold text-dark">{t.hero.projectTitle}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-dark">100%</p>
                    <p className="text-[10px] text-dark/60 uppercase">{t.hero.satisfaction}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
