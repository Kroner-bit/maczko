import React from 'react';
import { motion } from 'motion/react';
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-4"
          >
            {t.services.badge}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6 text-dark"
          >
            {t.services.title.split('{gradient}')[0]}
            <span className="text-gradient">{t.services.gradient}</span>
            {t.services.title.split('{gradient}')[1]}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-dark/60 max-w-2xl mx-auto"
          >
            {t.services.description}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 rounded-3xl glass hover:bg-white transition-all duration-500 hover:shadow-xl"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                <service.icon className="text-white w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-dark group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-dark/50 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Extra CTA in Services */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 rounded-[40px] bg-gradient-to-r from-primary/5 to-secondary/5 border border-black/5 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
