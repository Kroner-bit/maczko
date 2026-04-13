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
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MaltaContact from './MaltaContact';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function MaltaServices() {
  const [settings, setSettings] = useState({
    maltaTiktokEnabled: true,
    maltaTiktokUrls: [
      'https://www.tiktok.com/@maczkotetofedes/video/7485304675713436961',
      'https://www.tiktok.com/@maczkotetofedes/video/7485303648058608929',
      'https://www.tiktok.com/@maczkotetofedes/video/7485302684845083937'
    ]
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as any);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();

    // Load TikTok embed script
    const scriptId = 'tiktok-embed-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).tiktok?.embed?.lib?.render) {
      (window as any).tiktok.embed.lib.render();
    }

    // Re-render TikToks when settings change
    const timer = setTimeout(() => {
      if ((window as any).tiktok?.embed?.lib?.render) {
        (window as any).tiktok.embed.lib.render();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [settings.maltaTiktokUrls]);

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
      image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Stone Fence Construction & Repair',
      description: 'Expert construction and restoration of traditional Maltese Boundary walls and Rubble walls (Hitan tas-Sejjieh), ensuring they stand the test of time.',
      icon: Construction,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Structural Damage Repair',
      description: 'Post-storm emergency repairs, professional crack stitching, and static reinforcement to ensure your property remains safe and secure.',
      icon: ShieldAlert,
      image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Moisture & Damp Protection',
      description: 'Comprehensive waterproofing and damp-proofing treatments. We specialize in identifying and treating rising damp, a common challenge in Maltese properties.',
      icon: Droplets,
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Stone Surface Treatment',
      description: 'Specialized impregnation treatments for interior and exterior limestone walls to prevent crumbling (porlás) and protect against environmental wear.',
      icon: Hammer,
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800'
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
                    src="https://images.unsplash.com/photo-1635424710928-0544e8512eae?auto=format&fit=crop&q=80&w=800" 
                    alt="Maltese Limestone Architecture" 
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* TikTok Section */}
        {settings.maltaTiktokEnabled && (
          <section className="py-24 bg-white border-y border-black/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16 text-center">
                <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                  Social Media
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-dark mb-6">
                  Follow Our <span className="text-gradient">Work</span>
                </h2>
                <p className="text-dark/60 max-w-2xl mx-auto">
                  Check out our latest restoration projects and behind-the-scenes moments on TikTok.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {settings.maltaTiktokUrls.map((url, index) => {
                  // Try to extract video ID for direct iframe embed which supports autoplay better
                  // Handle both short URLs and full URLs
                  let videoId = null;
                  const videoIdMatch = url.match(/\/video\/(\d+)/) || url.match(/v=(\d+)/);
                  
                  if (videoIdMatch) {
                    videoId = videoIdMatch[1];
                  } else if (url.includes('vm.tiktok.com')) {
                    // For short URLs, we can't resolve them easily on client, 
                    // but we can try to extract the ID if it's in the path (rare for vm.tiktok.com)
                    const shortIdMatch = url.match(/vm\.tiktok\.com\/([a-zA-Z0-9]+)/);
                    if (shortIdMatch) {
                      // We still need the actual video ID for the embed/v2 URL to work perfectly with autoplay
                      // If we don't have it, we'll fall back to the blockquote
                    }
                  }

                  return (
                    <div key={`${index}-${url}`} className="rounded-[32px] overflow-hidden shadow-2xl bg-dark aspect-[9/16] relative group">
                      {videoId ? (
                        <iframe
                          src={`https://www.tiktok.com/embed/v2/${videoId}?autoplay=1&loop=1&muted=1&rel=0&controls=0`}
                          className="w-full h-full border-none pointer-events-none"
                          allow="autoplay; encrypted-media; picture-in-picture"
                          title={`TikTok Video ${index + 1}`}
                        />
                      ) : (
                        <blockquote 
                          className="tiktok-embed w-full h-full pointer-events-none" 
                          cite={url} 
                          data-video-id="" 
                          style={{ maxWidth: '100%', minWidth: '325px', height: '100%', margin: 0, padding: 0 }}
                        >
                          <section className="flex items-center justify-center h-full">
                            <div className="text-white/20">
                              <Play className="w-12 h-12" />
                            </div>
                          </section>
                        </blockquote>
                      )}
                      
                      {/* Visual Play Icon Overlay (optional, user requested play logo) */}
                      {!videoId && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Facade Cleaning', location: 'Sliema', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600' },
                { title: 'Stone Re-pointing', location: 'Valletta', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600' },
                { title: 'Boundary Wall', location: 'Mosta', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600' },
                { title: 'Damp Treatment', location: 'St. Julians', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600' }
              ].map((project, index) => (
                <div key={index} className="group relative rounded-[32px] overflow-hidden aspect-[3/4] shadow-lg">
                  <img 
                    src={project.img} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2">{project.location}</p>
                    <h4 className="text-white text-xl font-bold">{project.title}</h4>
                  </div>
                </div>
              ))}
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
