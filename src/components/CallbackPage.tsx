import React, { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../LanguageContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, setDoc, doc, increment } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Send, User, AtSign, PhoneCall, MessageSquare, CheckCircle2, Loader2, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function CallbackPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    services: [] as string[]
  });

  const toggleService = (title: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(title) 
        ? prev.services.filter(s => s !== title)
        : [...prev.services, title]
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const duration = 2000;
      const interval = 20;
      const step = (100 / (duration / interval));
      
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev + step >= 100) {
            clearInterval(timer);
            navigate('/');
            return 100;
          }
          return prev + step;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      setError(null);
      await addDoc(collection(db, 'submissions'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '', services: [] });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'submissions');
      setError('Hiba történt az üzenet küldésekor. Kérjük, próbálja újra később!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-light pt-24 pb-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-dark mb-4">Visszahívást kérek!</h1>
            <p className="text-dark/60 text-sm">Adja meg elérhetőségeit és hamarosan felvesszük Önnel a kapcsolatot.</p>
          </div>

          <div className="p-8 rounded-[32px] glass bg-white shadow-xl">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-dark mb-2">Köszönjük!</h3>
                <p className="text-dark/60 mb-6 text-sm">Hamarosan visszahívjuk. Visszairányítjuk a főoldalra...</p>
                
                <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest ml-1">{t.contact.form.name}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/20" />
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Kovács János"
                      className="w-full bg-white border border-black/5 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary transition-colors text-dark text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest ml-1">{t.contact.form.phone}</label>
                  <div className="relative">
                    <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/20" />
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+36 30 889 5383"
                      className="w-full bg-white border border-black/5 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary transition-colors text-dark text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 hidden">
                  <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest ml-1">{t.contact.form.email}</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/20" />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="janos@pelda.hu"
                      className="w-full bg-white border border-black/5 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary transition-colors text-dark text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 relative" ref={dropdownRef}>
                  <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest ml-1">
                    {language === 'hu' ? 'Szolgáltatások típusa (opcionális)' : 'Service type (optional)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white border border-black/5 rounded-2xl py-3 px-4 flex items-center justify-between focus:outline-none focus:border-primary transition-colors text-dark text-left"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex flex-col gap-1">
                        {formData.services.length === 0
                          ? <span className="text-dark/40 text-sm truncate block">{language === 'hu' ? 'Válasszon szolgáltatásokat...' : 'Select services...'}</span>
                          : formData.services.map(s => (
                              <span key={s} className="text-sm text-dark truncate block" title={s}>• {s}</span>
                            ))}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 flex-shrink-0 self-start text-dark/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-black/5 rounded-2xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto">
                      {t.services.items.map((service: { title: string }) => (
                        <button
                          key={service.title}
                          type="button"
                          onClick={() => toggleService(service.title)}
                          className="w-full px-4 py-2.5 text-left hover:bg-black/5 flex items-center justify-between transition-colors group"
                        >
                          <span className={cn(
                            "text-sm group-hover:text-primary transition-colors",
                            formData.services.includes(service.title) ? "font-bold text-primary" : "text-dark"
                          )}>
                            {service.title}
                          </span>
                          {formData.services.includes(service.title) && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-dark/40 uppercase tracking-widest ml-1">{t.contact.form.message} {language === 'hu' ? '(Opcionális)' : '(Optional)'}</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-dark/20" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder={language === 'hu' ? "Miben segíthetünk? (Nem kötelező)" : "How can we help? (Optional)"}
                      className="w-full bg-white border border-black/5 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary transition-colors resize-none text-dark text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
                    <Loader2 className="w-3 h-3" />
                    {error}
                  </div>
                )}

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full mt-2 py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-dark transition-all group shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {t.contact.form.submit}
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
