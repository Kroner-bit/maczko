import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../LanguageContext';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const isSubPage = location.pathname !== '/';
  const isMaltaPage = location.pathname === '/malta-services';
  const logoSrc = "https://kephost.net/p/MjM0NTg1NQ.png";
  const homePath = isMaltaPage ? "/malta-services" : "/";
  const isHomeLikePage = location.pathname === '/' || location.pathname === '/malta-services';

  useEffect(() => {
    if (isMaltaPage && language !== 'en') {
      setLanguage('en');
    }
  }, [isMaltaPage, language, setLanguage]);

  const navItems = isMaltaPage 
    ? [
        { name: t.nav.backToHu, href: '/', isExternal: true },
      ]
    : [
        { name: t.nav.home, href: isSubPage ? '/#home' : '#home' },
        { name: t.nav.services, href: isSubPage ? '/#services' : '#services' },
        { name: t.nav.about, href: isSubPage ? '/#about' : '#about' },
        { name: t.nav.portfolio, href: isMaltaPage ? '#portfolio' : (isSubPage ? '/#portfolio' : '#portfolio') },
        { name: t.nav.contact, href: isSubPage ? '/#contact' : '#contact' },
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
        'fixed top-0 left-0 right-0 z-50 px-6',
        (isScrolled || !isHomeLikePage)
          ? 'bg-white/90 backdrop-blur-md border-b border-black/5 shadow-md py-2' 
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={homePath} className="flex items-center md:gap-4 group">
          <img 
            src={logoSrc} 
            alt={`${t.brand.first} ${t.brand.second} Logo`} 
            className={cn(
              "w-auto block",
              (isScrolled || !isHomeLikePage) ? "h-10 md:h-12 lg:h-16" : "h-12 md:h-16 lg:h-24"
            )}
            referrerPolicy="no-referrer" 
          />
          <span className="hidden md:block text-2xl md:text-3xl font-display font-bold tracking-tight text-dark">
            {t.brand.first} <span className="text-primary">{t.brand.second}</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            item.isExternal ? (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-bold transition-colors",
                  location.pathname === item.href ? "text-primary" : "text-dark/70 hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            ) : (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-dark/70 hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            )
          ))}
          
          <div className="flex items-center gap-2 border-l border-black/10 pl-8">
            {!isMaltaPage && (
              <>
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
              </>
            )}
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
            href={isMaltaPage ? '#contact' : (isSubPage ? '/#contact' : '#contact')}
            className="px-5 py-2 rounded-full bg-primary text-white font-semibold text-sm hover:bg-dark transition-colors"
          >
            {t.nav.contact}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          {isMaltaPage ? (
            <span className="text-xs font-bold text-primary px-2">EN</span>
          ) : (
            <button
              onClick={() => setLanguage(language === 'hu' ? 'en' : 'hu')}
              className="p-2 rounded-full bg-black/5 text-dark/60"
            >
              <Globe className="w-5 h-5" />
            </button>
          )}
          <button
            className="text-dark"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-black/5 p-6 lg:hidden flex flex-col gap-4 shadow-xl">
          {navItems.map((item) => (
            item.isExternal ? (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-bold",
                  location.pathname === item.href ? "text-primary" : "text-dark/70 hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            ) : (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-dark/70 hover:text-primary"
              >
                {item.name}
              </a>
            )
          ))}
          <a
            href={isMaltaPage ? '#contact' : (isSubPage ? '/#contact' : '#contact')}
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-center"
          >
            {t.nav.contact}
          </a>
        </div>
      )}
    </nav>
  );
}
