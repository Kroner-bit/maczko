import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useGlobalSettings } from '../hooks/useGlobalSettings';
import { Facebook } from 'lucide-react';

export default function FacebookPosts() {
  const { t } = useLanguage();
  const { settings, loading } = useGlobalSettings();

  if (loading || !settings?.facebookPostsEnabled || !settings.facebookUrls) {
    return null;
  }

  const validUrls = settings.facebookUrls.filter((url: string) => url.trim() !== '');

  if (validUrls.length === 0) {
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

        <div className="grid md:grid-cols-3 gap-8">
          {validUrls.map((url: string, index: number) => {
            return (
              <div key={`${index}-${url}`} className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-black/5 flex items-center justify-center min-h-[400px]">
                <iframe
                  src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=auto`}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', overflow: 'hidden', minHeight: '400px' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title={`Facebook Post ${index + 1}`}
                />
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
             <a
                href="https://www.facebook.com/p/Maczk%C3%B3-Tet%C5%91fed%C3%A9s-100057684518734/"
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
