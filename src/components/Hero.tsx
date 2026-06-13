import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, ShieldCheck, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { cn } from '@/src/lib/utils';
import { useGlobalSettings } from '../hooks/useGlobalSettings';

export default function Hero() {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { settings } = useGlobalSettings();

  const images = [
    "https://kephost.net/p/MjM2ODI5OA.jpg",
    "https://kephost.net/p/MjM2ODI5OQ.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 md:pt-44 lg:pt-52 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-light">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
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
              {settings?.maltaPageEnabled && (
                <Link
                  to="/malta-services"
                  className="px-8 py-4 rounded-full bg-secondary text-white font-bold flex items-center gap-2 hover:bg-dark transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  {t.hero.ctaMalta}
                </Link>
              )}
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
            <div className="relative z-10 rounded-3xl overflow-hidden border border-black/5 shadow-2xl shadow-primary/5 h-[500px] w-full bg-black/5">
              {images.map((img, index) => (
                <div
                  key={img}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-1000 flex items-center justify-center overflow-hidden",
                    currentImageIndex === index ? "opacity-100" : "opacity-0"
                  )}
                >
                  <img
                    src={img}
                    alt={t.hero.projectTitle}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
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
