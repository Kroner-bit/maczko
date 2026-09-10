import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalSettings } from '../hooks/useGlobalSettings';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { settings } = useGlobalSettings();
  const location = useLocation();
  const isSubPage = location.pathname !== '/';
  const isMaltaPage = location.pathname === '/malta-services';
  const logoSrc = "/images/logo.png";
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
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <div className="grid items-center">
          <Link 
            to={homePath} 
            className={cn(
              "flex items-center md:gap-4 group col-start-1 row-start-1 transition-all duration-500",
              (isScrolled || location.pathname === '/visszahivas') ? "opacity-0 invisible -translate-y-4 lg:opacity-100 lg:visible lg:translate-y-0" : "opacity-100 visible translate-y-0"
            )}
          >
            <img 
              src={logoSrc} 
              alt={`${t.brand.first} ${t.brand.second} Logo`} 
              className={cn(
                "w-auto block transition-all duration-300",
                (isScrolled || !isHomeLikePage) ? "h-10 md:h-12 lg:h-16" : "h-12 md:h-16 lg:h-24"
              )}
              referrerPolicy="no-referrer" 
            />
            <span className="hidden md:block text-2xl md:text-3xl font-display font-bold tracking-tight text-dark">
              {t.brand.first} <span className="text-primary">{t.brand.second}</span>
            </span>
          </Link>

          {/* Mobile Central Button */}
          <div className={cn(
            "flex items-center lg:hidden col-start-1 row-start-1 transition-all duration-500",
            (isScrolled || location.pathname === '/visszahivas') ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"
          )}>
            {location.pathname === '/visszahivas' ? (
              <Link
                to="/"
                className="px-4 py-2 rounded-full bg-black/5 text-dark font-bold text-xs sm:text-sm whitespace-nowrap shadow-sm"
              >
                {language === 'hu' ? 'Főoldal' : 'Home'}
              </Link>
            ) : (
              <Link
                to="/visszahivas"
                className="px-4 py-2 rounded-full bg-primary text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-primary/30"
              >
                {language === 'hu' ? 'Visszahívást kérek!' : 'Call me back!'}
              </Link>
            )}
          </div>
        </div>

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
        <div className="flex items-center lg:hidden">
          <button
            className="text-dark p-1"
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
          
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-black/5">
            <button
              onClick={() => {
                setLanguage('hu');
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "font-bold px-4 py-2 rounded-lg transition-colors",
                language === 'hu' ? "bg-primary/10 text-primary" : "text-dark/40 hover:bg-black/5"
              )}
            >
              Magyar
            </button>
            <button
              onClick={() => {
                setLanguage('en');
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "font-bold px-4 py-2 rounded-lg transition-colors",
                language === 'en' ? "bg-primary/10 text-primary" : "text-dark/40 hover:bg-black/5"
              )}
            >
              English
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
