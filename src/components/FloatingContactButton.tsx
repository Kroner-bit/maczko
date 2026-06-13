import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { ClipboardList } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function FloatingContactButton() {
  const { t } = useLanguage();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const contactEntry = entries[0];
        // Hide button when contact section is intersecting (visible)
        setIsVisible(!contactEntry.isIntersecting);
      },
      {
        root: null,
        // Only trigger when the contact section is well into the viewport
        rootMargin: '0px 0px -200px 0px', 
        threshold: 0,
      }
    );

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      observer.observe(contactSection);
    }

    return () => {
      if (contactSection) {
        observer.unobserve(contactSection);
      }
      observer.disconnect();
    };
  }, [location.pathname]); // Re-run when navigation happens

  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/login')) {
    return null;
  }

  const isMaltaPage = location.pathname === '/malta-services';
  const isHomePage = location.pathname === '/';
  
  const contactHref = (isMaltaPage || isHomePage) ? '#contact' : '/#contact';

  return (
    <a
      href={contactHref}
      className={`fixed bottom-6 right-6 z-[999] flex items-center justify-center py-3.5 px-5 md:py-4 md:px-6 rounded-full bg-primary text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:bg-dark hover:-translate-y-1 transition-all duration-300 pointer-events-auto ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      title={location.pathname === '/malta-services' ? 'Get a Quote' : 'Ajánlatkérés'}
    >
      <ClipboardList className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
      <span className="font-bold whitespace-nowrap text-sm md:text-base">
        {location.pathname === '/malta-services' ? 'Get a Quote' : 'Ajánlatkérés'}
      </span>
    </a>
  );
}
