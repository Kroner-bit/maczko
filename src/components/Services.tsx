import React from 'react';
import { 
  Hammer, 
  Droplets, 
  Wind, 
  Trees, 
  Home, 
  Layers,
  Construction,
  ShieldCheck,
  Paintbrush,
  Wrench,
  Ruler
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const icons = [Layers, Wind, Construction, Droplets, Hammer, Home, ShieldCheck, Paintbrush, Trees, Wrench, Ruler];
  const services = t.services.items.map((item, index) => ({
    ...item,
    icon: icons[index % icons.length],
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative p-6 md:p-8 rounded-3xl glass bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/20">
                <service.icon className="text-primary w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-dark">{service.title}</h3>
                <p className="text-dark/60 leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            </div>
          ))}

          {/* Extra CTA in Services as the last list item */}
          <div className="md:col-span-2 p-6 md:p-8 rounded-3xl bg-primary/10 border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm mt-2">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-dark">{t.services.ctaTitle}</h3>
              <p className="text-dark/60">{t.services.ctaDesc}</p>
            </div>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-dark transition-colors whitespace-nowrap shrink-0"
            >
              {t.services.ctaButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
