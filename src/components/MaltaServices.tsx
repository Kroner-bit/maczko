import React, { useEffect, useState } from 'react';
import { 
  Hammer, 
  Droplets, 
  ShieldAlert, 
  Construction, 
  Layers, 
  ArrowLeft,
  CheckCircle2,
  CloudRain,
  AlertTriangle,
  Play,
  Loader2,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MaltaContact from './MaltaContact';
import { db } from '../firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Project } from '../types';
import { useGlobalSettings } from '../hooks/useGlobalSettings';

export default function MaltaServices() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const { settings, loading: settingsLoading } = useGlobalSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!settingsLoading && settings?.maltaPageEnabled === false) {
      navigate('/');
    }
  }, [settings?.maltaPageEnabled, settingsLoading, navigate]);

  useEffect(() => {
    // Fetch projects
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(data);
      setIsLoadingProjects(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setIsLoadingProjects(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const maltaTheme = {
    '--color-primary': '#126b31',
    '--color-secondary': '#126b31',
    '--color-dark': '#231A13',
    '--color-accent': '#126b31'
  } as React.CSSProperties;

  const services = [
    {
      title: 'Limestone Wall Restoration',
      description: 'Professional facade cleaning (sandblasting/washing), precise re-pointing, and replacement of crumbling or damaged stones to restore structural integrity and aesthetics.',
      icon: Layers,
      image: '/images/malta/malta-restoration.webp'
    },
    {
      title: 'Stone Fence Construction & Repair',
      description: 'Expert construction and restoration of traditional Maltese Boundary walls and Rubble walls (Hitan tas-Sejjieh), ensuring they stand the test of time.',
      icon: Construction,
      image: '/images/malta/malta-fence.webp'
    },
    {
      title: 'Structural Damage Repair',
      description: 'Post-storm emergency repairs, professional crack stitching, and static reinforcement to ensure your property remains safe and secure.',
      icon: ShieldAlert,
      image: '/images/malta/malta-restoration.webp'
    },
    {
      title: 'Moisture & Damp Protection',
      description: 'Comprehensive waterproofing and damp-proofing treatments. We specialize in identifying and treating rising damp, a common challenge in Maltese properties.',
      icon: Droplets,
      image: '/images/malta/malta-damp.webp'
    },
    {
      title: 'Stone Surface Treatment',
      description: 'Specialized impregnation treatments for interior and exterior limestone walls to prevent crumbling (porlás) and protect against environmental wear.',
      icon: Hammer,
      image: '/images/malta/malta-stone.webp'
    }
  ];

  const painPoints = [
    {
      question: 'Leaking wall?',
      answer: 'We find the source of the moisture and provide professional waterproofing solutions.',
      icon: CloudRain
    },
    {
      question: 'Crumbling facade?',
      answer: 'We stop the corrosion of the limestone and restore the surface to its original glory.',
      icon: AlertTriangle
    },
    {
      question: 'Storm damaged garden?',
      answer: 'We rebuild collapsed walls and repair structural damage quickly and efficiently.',
      icon: Construction
    }
  ];

  return (
    <div className="min-h-screen bg-light" style={maltaTheme} id="home">
      <Navbar />
      
      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative mb-24 overflow-hidden bg-light">
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 md:pt-44 lg:pt-52 pb-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-3xl text-left md:text-left">
                <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-8 text-dark">
                  Maltese Limestone <span className="text-gradient">Specialist</span> & Maintenance
                </h1>
                <p className="text-xl text-dark/60 leading-relaxed mb-10">
                  Local Maltese expertise with a focus on precision, cleanliness, and a full guarantee on all our stone restoration and maintenance services.
                </p>
                <div className="flex flex-wrap gap-4 justify-start">
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <span className="text-sm font-bold text-dark">Precision</span>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <span className="text-sm font-bold text-dark">Cleanliness</span>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <span className="text-sm font-bold text-dark">Full Guarantee</span>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                  <img 
                    src="/images/malta/malta-arch.webp" 
                    alt="Maltese Limestone Architecture" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section id="services" className="bg-white py-24 border-y border-black/5 scroll-mt-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-4xl font-display font-bold text-dark mb-4">Our Services</h2>
              <div className="w-20 h-1.5 bg-primary rounded-full" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.title} className="rounded-3xl bg-light border border-black/5 hover:shadow-xl transition-all group overflow-hidden flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg z-10">
                      <service.icon className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-8 flex-grow">
                    <h3 className="text-2xl font-bold mb-4 text-dark group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-dark/60 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="portfolio" className="py-24 bg-light overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
              <div>
                <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                  Portfolio
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-dark">
                  Recent <span className="text-gradient">Projects</span>
                </h2>
              </div>
              <p className="text-dark/60 max-w-md">
                A showcase of our professional limestone restoration and maintenance work across Malta.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoadingProjects ? (
                <div className="col-span-full flex justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : projects.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-light rounded-[40px] border border-black/5">
                  <p className="text-dark/40 font-bold uppercase tracking-widest">No recent projects to show</p>
                </div>
              ) : (
                projects.map((project) => (
                  <Link 
                    key={project.id || project.slug} 
                    to={`/project/${project.slug}`}
                    className="group relative rounded-[32px] overflow-hidden aspect-[4/5] shadow-lg block border border-black/5"
                  >
                    <img 
                      src={project.images[0]} 
                      alt={project.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
                    
                    <div className="absolute inset-0 p-8 flex flex-col justify-end group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{project.category}</p>
                          <h4 className="text-white text-2xl font-bold">{project.title}</h4>
                          <p className="text-sm text-white/70">{project.location}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <Search className="text-white w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <MaltaContact />
      </main>

      <Footer />
    </div>
  );
}
