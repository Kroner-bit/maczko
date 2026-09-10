import React from 'react';
import { Facebook } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalSettings } from '../hooks/useGlobalSettings';

export default function Footer() {
  const { t } = useLanguage();
  const location = useLocation();
  const { settings } = useGlobalSettings();
  const isMaltaPage = location.pathname === '/malta-services';
  const logoSrc = "/images/logo.webp";
  const homePath = isMaltaPage ? "/malta-services" : "/";
  const isHomeLikePage = location.pathname === '/' || location.pathname === '/malta-services';

  return (
    <footer className="py-12 border-t border-black/5 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link to={homePath} className="flex items-center gap-3">
            <img 
              src={logoSrc} 
              alt={`${t.brand.first} ${t.brand.second} Logo`} 
              className="h-10 w-auto" 
              referrerPolicy="no-referrer" 
            />
            <span className="hidden md:block text-xl md:text-2xl font-display font-bold tracking-tight text-dark">
              {t.brand.first} <span className="text-primary">{t.brand.second}</span>
            </span>
          </Link>

          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-dark/40">
              © 2026 {t.brand.first} {t.brand.second}. {t.footer.rights}
            </p>
            {settings?.maltaPageEnabled && (
              <Link to="/malta-services" className="text-xs font-bold text-primary hover:text-dark transition-colors uppercase tracking-widest">
                {t.nav.malta}
              </Link>
            )}
          </div>

          <div className="flex gap-6">
            <a href="https://www.facebook.com/p/Maczk%C3%B3-Tet%C5%91fed%C3%A9s-100057684518734/" target="_blank" rel="noopener noreferrer" className="text-dark/40 hover:text-primary transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
