import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useGlobalSettings } from '../hooks/useGlobalSettings';
import { Facebook } from 'lucide-react';

export default function FacebookPosts() {
  const { t } = useLanguage();
  const { settings, loading } = useGlobalSettings();

  if (loading || !settings?.facebookPostsEnabled) {
    return null;
  }

  const pageUrl = settings.facebookPageUrl?.trim() || '';
  const validUrls = (settings.facebookUrls || []).filter((url: string) => url.trim() !== '');

  if (!pageUrl && validUrls.length === 0) {
    return null;
  }

  // Parse Facebook page ID if using the /p/Name-ID/ format, which the plugin hates
  let iframeUrl = pageUrl;
  const match = pageUrl.match(/-(\d+)\/?$/);
  if (match && match[1]) {
    iframeUrl = `https://www.facebook.com/profile.php?id=${match[1]}`;
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

        {validUrls.length > 0 ? (
          <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 items-start">
            {validUrls.map((url: string, index: number) => {
              // Ensure we use the proper format. If not already an iframe src link, maybe it's just a regular post url. 
              // We'll trust that the user pasted an iframe src or iframe string (which the Admin component parsed to src)
              // If it's a direct facebook post link, format it. But let's assume it's already an embed url or standard url.
              const srcUrl = url.includes('plugins/post.php') 
                ? url 
                : `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=auto`;
                
              return (
                <div key={`${index}-${url}`} className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-black/5 flex items-center justify-center min-h-[500px] w-[85vw] md:w-full shrink-0 snap-center md:snap-none">
                  <iframe
                    src={srcUrl}
                    width="100%"
                    height="600"
                    style={{ border: 'none', overflow: 'hidden', minHeight: '600px', maxWidth: '100%' }}
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
        ) : pageUrl ? (
          <div className="flex justify-center flex-col items-center">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-black/5 flex items-center justify-center max-w-full w-[500px]">
               <iframe 
                 src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(iframeUrl)}&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`} 
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
        ) : null}
        
        {pageUrl && (
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
        )}
      </div>
    </section>
  );
}
