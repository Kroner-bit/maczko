import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { ClipboardList, PhoneCall } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function FloatingContactButton() {
  const { t } = useLanguage();
  const location = useLocation();
  const [isOnContact, setIsOnContact] = useState(false);
  const [isAtTopMobile, setIsAtTopMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setIsAtTopMobile(window.scrollY < 100);
      } else {
        setIsAtTopMobile(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const contactEntry = entries[0];
        setIsOnContact(contactEntry.isIntersecting);
      },
      {
        root: null,
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
  }, [location.pathname]);

  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/login')) {
    return null;
  }

  const isMaltaPage = location.pathname === '/malta-services';
  const isHomePage = location.pathname === '/';
  
  const contactHref = (isMaltaPage || isHomePage) ? '#contact' : '/#contact';
  
  const isVisible = !isOnContact && !isAtTopMobile;

  return (
    <div className={`fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3 transition-all duration-300 pointer-events-none ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <Link
        to="/visszahivas"
        className="hidden md:flex pointer-events-auto items-center justify-center py-4 px-6 rounded-full bg-white text-dark shadow-xl hover:shadow-2xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 border border-black/5"
        title={location.pathname === '/malta-services' ? 'Call me back' : 'Visszahívást kérek'}
      >
        <PhoneCall className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-primary" />
        <span className="font-bold whitespace-nowrap text-sm md:text-base">
          {location.pathname === '/malta-services' ? 'Call me back' : 'Visszahívást kérek'}
        </span>
      </Link>

      <a
        href={contactHref}
        className="pointer-events-auto flex items-center justify-center py-3.5 px-5 md:py-4 md:px-6 rounded-full bg-primary text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:bg-dark hover:-translate-y-1 transition-all duration-300"
        title={location.pathname === '/malta-services' ? 'Get a Quote' : 'Ajánlatkérés'}
      >
        <ClipboardList className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
        <span className="font-bold whitespace-nowrap text-sm md:text-base">
          {location.pathname === '/malta-services' ? 'Get a Quote' : 'Ajánlatkérés'}
        </span>
      </a>
    </div>
  );
}
