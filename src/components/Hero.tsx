import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, ShieldCheck, Award, MapPin, Facebook, Sparkles, Layers, Wind, Construction, Droplets, Hammer, Home, Paintbrush, Trees, Wrench, Ruler, Fence, FileSignature, Axe, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { cn } from '@/src/lib/utils';
import { useGlobalSettings } from '../hooks/useGlobalSettings';
import { motion, AnimatePresence } from 'motion/react';

export default function Hero() {
  const { t, language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isMobileDescExpanded, setIsMobileDescExpanded] = useState(false);
  const { settings } = useGlobalSettings();

  const images = [
    "/images/hero1.webp",
    "/images/hero2.webp"
  ];

  const icons = [
    Layers,           // 1. Teljes tetők
    Wind,             // 2. Vihar utáni károk
    Construction,     // 3. Lapos tetők
    Droplets,         // 4. Beázások
    Hammer,           // 5. Kémények
    Home,             // 6. Régi tetők
    ShieldCheck,      // 7. Bádogos munkák
    Fence,            // 8. Kerítések
    Paintbrush,       // 9. Széldeszka
    Wrench,           // 10. Alpintechnikai
    Ruler,            // 11. Zsindelytetők
    Trees,            // 12. Fa- és fémszerkezetek
    Home,             // 13. Kerti tárolók
    FileSignature,    // 14. Biztosítási ügyek
    Axe               // 15. Veszélyes fakivágás
  ];

  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(imageTimer);
  }, [images.length]);

  useEffect(() => {
    const serviceTimer = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % t.services.items.length);
    }, 5000); // Slower animation (was 3000)
    return () => clearInterval(serviceTimer);
  }, [t.services.items.length]);

  const CurrentIcon = icons[currentServiceIndex % icons.length];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 md:pt-44 lg:pt-52 pb-16 md:pb-0 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-light pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[64px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[64px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center lg:items-start flex-col-reverse flex lg:grid">
          <div className="text-center lg:text-left pt-6 sm:pt-0">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 text-dark flex flex-col gap-2">
              <span>{t.hero.title.split('{gradient}')[0]}</span>
              <span className="text-gradient text-5xl sm:text-6xl md:text-8xl py-2">{t.hero.gradient}</span>
              <span>{t.hero.title.split('{gradient}')[1]}</span>
            </h1>

            <div className="h-10 sm:h-12 mb-6 lg:hidden flex items-center justify-center lg:justify-start overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentServiceIndex}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-full border border-primary/20 shadow-sm"
                >
                  <CurrentIcon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm sm:text-base font-bold text-dark whitespace-nowrap">
                    {t.services.items[currentServiceIndex].title}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="mx-auto lg:mx-0 mb-8 md:mb-10 max-w-lg">
              <div 
                className={cn(
                  "text-base sm:text-lg text-dark/60 leading-relaxed transition-all duration-300 relative",
                  !isMobileDescExpanded ? "line-clamp-4 lg:line-clamp-none overflow-hidden" : ""
                )}
              >
                {t.hero.description}
                {!isMobileDescExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white lg:hidden to-transparent pointer-events-none" />
                )}
              </div>
              <button 
                onClick={() => setIsMobileDescExpanded(!isMobileDescExpanded)}
                className="mt-3 text-primary text-sm font-bold flex items-center justify-center gap-1.5 mx-auto lg:hidden hover:text-dark transition-colors px-4 py-2 bg-primary/5 rounded-full"
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

            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#contact"
                className="w-full sm:w-auto group px-8 py-4 rounded-full bg-primary text-white font-bold flex justify-center items-center gap-2 hover:bg-dark transition-colors"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#portfolio"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-black/5 shadow-sm font-bold flex justify-center items-center gap-2 hover:bg-light transition-colors"
              >
                {t.hero.ctaSecondary}
                <ChevronRight className="w-5 h-5" />
              </a>
              {settings?.maltaPageEnabled && (
                <Link
                  to="/malta-services"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-secondary text-white font-bold flex justify-center items-center gap-2 hover:bg-dark transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  {t.hero.ctaMalta}
                </Link>
              )}
              <a
                href="https://www.facebook.com/p/Maczk%C3%B3-Tet%C5%91fed%C3%A9s-100057684518734/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-[56px] h-14 sm:h-[56px] rounded-full sm:rounded-full rounded-2xl bg-[#1877F2] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#1877F2]/90 transition-all shadow-lg shadow-[#1877F2]/20 shrink-0"
              >
                <Facebook className="w-6 h-6 fill-white" />
                <span className="sm:hidden">Facebook</span>
              </a>
            </div>

            <div className="mt-10 md:mt-12 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-dark">{t.hero.badge1}</span>
              </div>
              <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-dark">{t.hero.badge2}</span>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-[500px] mx-auto lg:max-w-none flex flex-col items-center">
            <div className="relative z-10 rounded-3xl overflow-hidden border border-black/5 shadow-2xl shadow-primary/5 h-[300px] sm:h-[400px] md:h-[500px] w-full bg-black/5">
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
                    decoding="async"
                    loading={index === 0 ? "eager" : "lazy"}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
            
            {/* Desktop Service Animation */}
            <div className="hidden lg:block w-full max-w-md min-h-[140px] relative z-20 -mt-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentServiceIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-md shadow-xl shadow-primary/10 p-6 rounded-[24px] border border-primary/20 flex flex-col justify-center gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center">
                      <CurrentIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-dark truncate">
                      {t.services.items[currentServiceIndex].title}
                    </h3>
                  </div>
                  <p className="text-dark/60 text-sm leading-relaxed pl-[52px]">
                    {t.services.items[currentServiceIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
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
