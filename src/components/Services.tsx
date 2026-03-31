import React from 'react';
import { 
  Hammer, 
  Droplets, 
  Wind, 
  Trees, 
  Home, 
  Layers 
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const icons = [Layers, Droplets, Trees, Hammer, Wind, Home];
  const colors = [
    'from-cyan-400 to-blue-500',
    'from-teal-400 to-emerald-500',
    'from-green-400 to-teal-500',
    'from-blue-400 to-indigo-500',
    'from-sky-400 to-blue-600',
    'from-cyan-500 to-teal-600',
  ];

  const services = t.services.items.map((item, index) => ({
    ...item,
    icon: icons[index],
    color: colors[index],
  }));

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-white scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-4">
            {t.services.badge}
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-dark">
            {t.services.title.split('{gradient}')[0]}
            <span className="text-gradient">{t.services.gradient}</span>
            {t.services.title.split('{gradient}')[1]}
          </h2>
          <p className="text-dark/60 max-w-2xl mx-auto">
            {t.services.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative p-8 rounded-3xl glass bg-white shadow-sm"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}>
                <service.icon className="text-white w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-dark">{service.title}</h3>
              <p className="text-dark/50 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Extra CTA in Services */}
        <div className="mt-20 p-12 rounded-[40px] bg-gradient-to-r from-primary/5 to-secondary/5 border border-black/5 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold mb-2 text-dark">{t.services.ctaTitle}</h3>
            <p className="text-dark/60">{t.services.ctaDesc}</p>
          </div>
          <a
            href="#contact"
            className="px-8 py-4 rounded-full bg-dark text-white font-bold hover:bg-primary transition-colors whitespace-nowrap"
          >
            {t.services.ctaButton}
          </a>
        </div>
      </div>
    </section>
  );
}
