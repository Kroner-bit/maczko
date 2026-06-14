import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, User, AtSign, PhoneCall, CheckCircle2, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, setDoc, doc, increment } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function MaltaContact() {
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
      await addDoc(collection(db, 'malta_submissions'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      try {
        const today = new Date().toISOString().split('T')[0];
        await setDoc(doc(db, 'daily_stats', today), {
          quoteRequests: increment(1),
          date: today
        }, { merge: true });
      } catch (statErr) {
        console.error('Analytics error:', statErr);
      }
      
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'malta_submissions');
      setError('An error occurred while sending the message. Please try again later!');
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
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
              Contact
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-dark">
              Get a <span className="text-gradient">Free</span> Quote!
            </h2>
            <p className="text-lg text-dark/60 mb-12 leading-relaxed">
              We are ready to help with your property restoration or maintenance. Contact us today!
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                  <Phone className="text-primary group-hover:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="text-xl font-bold text-dark">+36 30 889 5383</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                  <Mail className="text-primary group-hover:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-xl font-bold text-dark">maczkozsolt@icloud.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                  <MapPin className="text-primary group-hover:text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">Location</p>
                  <p className="text-xl font-bold text-dark">Malta, Sliema</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 rounded-[40px] glass relative shadow-xl">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-dark mb-2">Thank you!</h3>
                <p className="text-dark/60">Your message has been sent successfully. We will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-dark"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                      <input
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-dark"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+36 30 889 5383"
                      className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-dark"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-6 w-5 h-5 text-dark/20" />
                    <textarea
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors resize-none text-dark"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2">
                    <Loader2 className="w-4 h-4" />
                    {error}
                  </div>
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
                      Send Message
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
