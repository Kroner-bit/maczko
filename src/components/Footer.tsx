import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import logoImg from '../assets/logo.png';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 border-t border-black/5 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="Maczkó Tetőfedés Logo" 
              className="h-10 w-auto" 
              referrerPolicy="no-referrer" 
            />
            <span className="text-lg font-display font-bold tracking-tight text-dark">
              Maczkó <span className="text-primary">Tetőfedés</span>
            </span>
          </div>

          <p className="text-sm text-dark/40">
            © 2026 Maczkó Tetőfedés. {t.footer.rights}
          </p>

          <div className="flex gap-6">
            <a href="#" className="text-dark/40 hover:text-primary transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-dark/40 hover:text-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
