import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Search, Loader2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Project } from '../types';

export default function Portfolio() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
              className="hidden md:flex px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-dark transition-all items-center gap-2"
            >
              {t.contact.form.submit} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-light rounded-[40px] border border-black/5">
            <p className="text-dark/40 font-bold uppercase tracking-widest">Nincsenek még elérhető referenciák</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id || project.slug}
                to={`/project/${project.slug}`}
                className="group relative aspect-[4/5] rounded-[32px] overflow-hidden border border-black/5 shadow-sm block"
              >
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
