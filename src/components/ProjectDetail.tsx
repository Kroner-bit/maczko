import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { ChevronLeft, Calendar, MapPin, Tag, ShieldCheck, ChevronRight, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Project } from '../types';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

export default function ProjectDetail() {
  const { t } = useLanguage();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;
      
      try {
        const q = query(collection(db, 'projects'), where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setProject({ id: doc.id, ...doc.data() } as Project);
        } else {
          // If project not found, redirect to portfolio
          navigate('/#portfolio');
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <main className="pt-24 lg:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/#portfolio" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:text-dark transition-colors group">
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            {t.projectDetail.back}
          </Link>

          {/* Project Info Section */}
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-7">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                {t.projectDetail.badge}
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-dark mb-8">
                {project.title}
              </h1>
              
              <div className="prose prose-lg prose-slate mb-12">
                <p className="text-lg text-dark/70 leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>

              <div className="bg-dark text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-125 duration-700" />
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full" />
                  {t.projectDetail.features}
                </h3>
                <ul className="grid sm:grid-cols-2 gap-6">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4 text-white/90">
                      <div className="w-6 h-6 shrink-0 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-base font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 gap-6 h-full">
                <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-8 text-center">{t.portfolio.badge}</h4>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-light transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Tag className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-dark/30 uppercase font-bold tracking-wider mb-0.5">{t.projectDetail.category}</p>
                        <p className="font-bold text-dark text-lg">{project.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-light transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-dark/30 uppercase font-bold tracking-wider mb-0.5">{t.projectDetail.location}</p>
                        <p className="font-bold text-dark text-lg">{project.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-light transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-dark/30 uppercase font-bold tracking-wider mb-0.5">{t.projectDetail.date}</p>
                        <p className="font-bold text-dark text-lg">{project.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-light transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-dark/30 uppercase font-bold tracking-wider mb-0.5">{t.projectDetail.warranty}</p>
                        <p className="font-bold text-dark text-lg">{t.projectDetail.warrantyValue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Swiper Gallery Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-display font-bold text-dark">{t.projectDetail.gallery}</h2>
            </div>

            <div className="relative group">
              <Swiper
                spaceBetween={10}
                navigation={true}
                pagination={{ clickable: true, dynamicBullets: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[FreeMode, Navigation, Thumbs, Pagination, Autoplay]}
                className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-6 bg-dark aspect-[16/9] lg:aspect-[21/9]"
              >
                {project.images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img 
                      src={img} 
                      alt={`${project.title} ${i + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={16}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Thumbs]}
                className="thumbs-swiper h-24 lg:h-32"
                breakpoints={{
                  640: { slidesPerView: 4 },
                  1024: { slidesPerView: 6 },
                }}
              >
                {project.images.map((img, i) => (
                  <SwiperSlide key={i} className="rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300">
                    {({ isActive }: { isActive: boolean }) => (
                      <div className={cn(
                        "w-full h-full transition-all duration-300",
                        isActive ? "opacity-100 scale-95" : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                      )}>
                        <img 
                          src={img} 
                          alt={`Thumbnail ${i + 1}`} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Styles for Swiper Buttons */}
              <style>{`
                .swiper-button-next, .swiper-button-prev {
                  background: rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(12px);
                  width: 54px;
                  height: 54px;
                  border-radius: 50%;
                  color: white;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  transition: all 0.3s ease;
                }
                .swiper-button-next:after, .swiper-button-prev:after {
                  font-size: 20px;
                  font-weight: bold;
                }
                .swiper-button-next:hover, .swiper-button-prev:hover {
                  background: var(--color-primary);
                  border-color: var(--color-primary);
                  transform: scale(1.1);
                }
                .swiper-pagination-bullet-active {
                  background: var(--color-primary) !important;
                }
                .thumbs-swiper .swiper-slide-thumb-active {
                  border-color: var(--color-primary) !important;
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .thumbs-swiper .swiper-slide {
                  border-color: transparent;
                }
              `}</style>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
