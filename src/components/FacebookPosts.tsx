import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useGlobalSettings } from '../hooks/useGlobalSettings';
import { Facebook } from 'lucide-react';

export default function FacebookPosts() {
  const { t } = useLanguage();
  const { settings, loading } = useGlobalSettings();

  if (loading || !settings?.facebookPostsEnabled || !settings.facebookPageUrl) {
    return null;
  }

  const pageUrl = settings.facebookPageUrl.trim();

  if (!pageUrl) {
    return null;
  }

  return (
    <section className="py-24 bg-light border-y border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/20 text-xs font-bold text-[#1877F2] uppercase tracking-widest mb-4">
            Közösségi Média
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-dark mb-6">
            Legutóbbi <span className="text-[#1877F2]">Posztjaink</span>
          </h2>
        </div>

        <div className="flex justify-center flex-col items-center">
          <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-black/5 flex items-center justify-center max-w-full w-[500px]">
             <iframe 
               src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(pageUrl)}&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`} 
               width="500" 
               height="600" 
               style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
               scrolling="no" 
               frameBorder="0" 
               allowFullScreen={true} 
               allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
               title="Facebook Page Feed"
             />
          </div>
        </div>
        
        <div className="mt-12 text-center">
             <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-8 py-4 rounded-full bg-[#1877F2] text-white font-bold items-center gap-2 hover:bg-[#1877F2]/90 transition-all shadow-lg shadow-[#1877F2]/20"
              >
                <Facebook className="w-5 h-5 fill-white" />
                Kövess Még Több Tartalomért
              </a>
        </div>
      </div>
    </section>
  );
}
