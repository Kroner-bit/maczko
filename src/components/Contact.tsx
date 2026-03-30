import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, User, AtSign, PhoneCall, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function Contact() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
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
    <section id="contact" className="py-24 relative overflow-hidden bg-light scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
              {t.contact.badge}
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-dark">
              {t.contact.title.split('{gradient}')[0]}
              <span className="text-gradient">{t.contact.gradient}</span>
              {t.contact.title.split('{gradient}')[1]}
            </h2>
            <p className="text-lg text-dark/60 mb-12 leading-relaxed">
              {t.contact.desc}
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                  <Phone className="text-primary group-hover:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">{t.contact.form.phone}</p>
                  <p className="text-xl font-bold text-dark">+36 30 123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                  <Mail className="text-primary group-hover:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">{t.contact.form.email}</p>
                  <p className="text-xl font-bold text-dark">info@maczkotetofedes.hu</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                  <MapPin className="text-primary group-hover:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">Székhely</p>
                  <p className="text-xl font-bold text-dark">1121 Budapest, Hegyhát út 12.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-10 rounded-[40px] glass relative shadow-xl"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-dark mb-2">Köszönjük!</h3>
                  <p className="text-dark/60">Üzenetét sikeresen elküldtük. Hamarosan felvesszük Önnel a kapcsolatot.</p>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">{t.contact.form.name}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                        <input
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          type="text"
                          placeholder="Kovács János"
                          className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-dark"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">{t.contact.form.email}</label>
                      <div className="relative">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                        <input
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          type="email"
                          placeholder="janos@pelda.hu"
                          className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-dark"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">{t.contact.form.phone}</label>
                    <div className="relative">
                      <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel"
                        placeholder="+36 30 000 0000"
                        className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-dark"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">{t.contact.form.message}</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-6 w-5 h-5 text-dark/20" />
                      <textarea
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Miben segíthetünk?"
                        className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors resize-none text-dark"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4" />
                      {error}
                    </motion.div>
                  )}

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-5 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-dark transition-all group shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t.contact.form.submit}
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
