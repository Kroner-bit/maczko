import React, { useState } from 'react';
import { Target, Users, Heart, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { cn } from '@/src/lib/utils';

export default function About() {
  const { t, language } = useLanguage();
  const [isMobileDescExpanded, setIsMobileDescExpanded] = useState(false);

  const icons = [Target, Users, Heart, Lightbulb];
  const values = t.about.values.map((value, index) => ({
    ...value,
    icon: icons[index],
  }));

  return (
    <section id="about" className="py-24 bg-light relative overflow-hidden scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
              {t.about.badge}
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-dark">
              {t.about.title.split('{gradient}')[0]}
              <span className="text-gradient">{t.about.gradient}</span>
              {t.about.title.split('{gradient}')[1]}
            </h2>
            
            <div className="mb-10 relative">
              <div 
                className={cn(
                  "text-lg text-dark/60 leading-relaxed transition-all duration-300 relative",
                  !isMobileDescExpanded ? "line-clamp-4 lg:line-clamp-none overflow-hidden" : ""
                )}
              >
                <p className="mb-4">{t.about.desc1}</p>
                <p>{t.about.desc2}</p>
                {!isMobileDescExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white lg:hidden to-transparent pointer-events-none" />
                )}
              </div>
              <button 
                onClick={() => setIsMobileDescExpanded(!isMobileDescExpanded)}
                className="mt-3 text-primary text-sm font-bold flex flex-row items-center justify-center gap-1.5 lg:hidden hover:text-dark transition-colors px-4 py-2 bg-primary/5 rounded-full"
                aria-expanded={isMobileDescExpanded}
              >
                {isMobileDescExpanded ? (
                  <>
                    <span>{language === 'hu' ? 'Kevesebb olvasása' : 'Read less'}</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>{language === 'hu' ? 'Tovább olvasom' : 'Read more'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">15+</p>
                <p className="text-sm text-dark/40 uppercase tracking-widest font-bold">{t.about.stat1}</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">500+</p>
                <p className="text-sm text-dark/40 uppercase tracking-widest font-bold">{t.about.stat2}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl glass bg-white shadow-sm flex sm:flex-col items-start gap-4 sm:gap-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center sm:mb-6">
                  <value.icon className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-3 text-dark">{value.title}</h3>
                  <p className="text-sm text-dark/50 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
