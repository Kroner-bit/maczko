import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, Heart, Lightbulb } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const icons = [Target, Users, Heart, Lightbulb];
  const values = t.about.values.map((value, index) => ({
    ...value,
    icon: icons[index],
  }));

  return (
    <section id="about" className="py-24 bg-light relative overflow-hidden scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
              {t.about.badge}
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-dark">
              {t.about.title.split('{gradient}')[0]}
              <span className="text-gradient">{t.about.gradient}</span>
              {t.about.title.split('{gradient}')[1]}
            </h2>
            <p className="text-lg text-dark/60 mb-8 leading-relaxed">
              {t.about.desc1}
            </p>
            <p className="text-lg text-dark/60 mb-10 leading-relaxed">
              {t.about.desc2}
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">15+</p>
                <p className="text-sm text-dark/40 uppercase tracking-widest font-bold">{t.about.stat1}</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">500+</p>
                <p className="text-sm text-dark/40 uppercase tracking-widest font-bold">{t.about.stat2}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl glass hover:bg-white transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <value.icon className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-dark">{value.title}</h3>
                <p className="text-sm text-dark/50 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
