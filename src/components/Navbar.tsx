import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../LanguageContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.portfolio, href: '#portfolio' },
    { name: t.nav.contact, href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6',
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-black/5 shadow-md py-2' 
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#home" className="flex items-center md:gap-4 group">
          <img 
            src="/logo.png" 
            alt="Maczkó Tetőfedés Logo" 
            className={cn(
              "w-auto transition-all duration-500 group-hover:scale-105 hidden md:block",
              isScrolled ? "h-12 lg:h-16" : "h-16 lg:h-24"
            )}
            referrerPolicy="no-referrer" 
          />
          <span className="text-xl font-display font-bold tracking-tight text-dark">
            Maczkó <span className="text-primary">Tetőfedés</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-dark/70 hover:text-primary transition-colors"
            >
              {item.name}
            </a>
          ))}
          
          <div className="flex items-center gap-2 border-l border-black/10 pl-8">
            <button
              onClick={() => setLanguage('hu')}
              className={cn(
                "text-xs font-bold transition-colors",
                language === 'hu' ? "text-primary" : "text-dark/40 hover:text-dark"
              )}
            >
              HU
            </button>
            <span className="text-dark/10">|</span>
            <button
              onClick={() => setLanguage('en')}
              className={cn(
                "text-xs font-bold transition-colors",
                language === 'en' ? "text-primary" : "text-dark/40 hover:text-dark"
              )}
            >
              EN
            </button>
          </div>

          <a
            href="#contact"
            className="px-5 py-2 rounded-full bg-primary text-white font-semibold text-sm hover:bg-dark transition-colors"
          >
            {t.nav.contact}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setLanguage(language === 'hu' ? 'en' : 'hu')}
            className="p-2 rounded-full bg-black/5 text-dark/60"
          >
            <Globe className="w-5 h-5" />
          </button>
          <button
            className="text-dark"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-black/5 p-6 lg:hidden flex flex-col gap-4 shadow-xl"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-dark/70 hover:text-primary"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-center"
            >
              {t.nav.contact}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
