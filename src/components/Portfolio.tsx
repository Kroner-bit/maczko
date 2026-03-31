import React from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const projects = [
  {
    title: 'Modern Családi Ház',
    category: 'Zsindelytető',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
    location: 'Budapest, II. kerület',
  },
  {
    title: 'Lapos Tető Szigetelés',
    category: 'Szigetelés',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    location: 'Szentendre',
  },
  {
    title: 'Klasszikus Villa',
    category: 'Tetőfelújítás',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
    location: 'Gödöllő',
  },
  {
    title: 'Ipari Csarnok',
    category: 'Bádogozás',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    location: 'Budaörs',
  },
  {
    title: 'Tetőtér Beépítés',
    category: 'Ácsmunka',
    image: 'https://images.unsplash.com/photo-1449156001437-3a1442737a31?auto=format&fit=crop&q=80&w=800',
    location: 'Dunakeszi',
  },
  {
    title: 'Kémény Felújítás',
    category: 'Kőműves munka',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    location: 'Budapest, XII. kerület',
  },
];

export default function Portfolio() {
  const { t } = useLanguage();

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-white scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-4">
              {t.portfolio.badge}
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-dark">
              {t.portfolio.title.split('{gradient}')[0]}
              <span className="text-gradient">{t.portfolio.gradient}</span>
              {t.portfolio.title.split('{gradient}')[1]}
            </h2>
          </div>
          <div>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-dark transition-all flex items-center gap-2"
            >
              {t.contact.form.submit} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group relative aspect-[4/5] rounded-[32px] overflow-hidden border border-black/5 shadow-sm"
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{project.category}</p>
                    <h3 className="text-2xl font-bold mb-1 text-white">{project.title}</h3>
                    <p className="text-sm text-white/70">{project.location}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Search className="text-white w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
