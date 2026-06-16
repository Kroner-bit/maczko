import React, { useState, useMemo } from 'react';
import { 
  Hammer, 
  Droplets, 
  Wind, 
  Trees, 
  Home, 
  Layers,
  Construction,
  ShieldCheck,
  Paintbrush,
  Wrench,
  Ruler,
  ClipboardCheck,
  Fence,
  FileSignature,
  Axe,
  ChevronDown,
  ChevronUp,
  Search,
  X
} from 'lucide-react';
import { useLanguage, Language } from '../LanguageContext';
import { cn } from '@/src/lib/utils';

const searchKeywords: Record<Language, string[][]> = {
  hu: [
    ['tető', 'teljes', 'új tető', 'építés', 'kivitelezés', 'cserép', 'tetőfedés', 'ácsmunka'], // 0. Teljes tetők
    ['vihar', 'kár', 'helyreállítás', 'javítás', 'beázás', 'sürgős', 'SOS', 'szélkár', 'letört', 'megbontott'], // 1. Vihar utáni
    ['lapostető', 'szigetelés', 'nehézlemez', 'bitumen', 'beázásmentes', 'szigetelő', 'tetőszigetelés'], // 2. Lapos tetők
    ['beázás', 'víz', 'szivárgás', 'folt', 'megszüntetés', 'javítás', 'felderítés', 'csöpög'], // 3. Beázások
    ['kémény', 'felújítás', 'bádogozás', 'átépítés', 'megerősítés', 'kéményszegély', 'kéményfej', 'vakolás', 'bontás'], // 4. Kémények
    ['régi tető', 'helyreállítás', 'műemlék', 'elöregedett', 'rekonstrukció', 'cserepeslemez', 'felújítás', 'átrakás'], // 5. Régi tetők
    ['bádogos', 'eresz', 'csatorna', 'szegély', 'lemez', 'hajlítás', 'lefolyó', 'vízelvezetés', 'cinklemez', 'aluminium'], // 6. Bádogos munkák
    ['kerítés', 'építés', 'felújítás', 'famunka', 'fém', 'drótkerítés', 'léces', 'oszlop', 'kapu'], // 7. Kerítések
    ['széldeszka', 'ereszalj', 'javítás', 'festés', 'faanyagvédelem', 'lambéria', 'deszkázat', 'oromdeszka', 'dobozolás'], // 8. Széldeszka
    ['alpin', 'alpintechnika', 'nehezen elérhető', 'társasház', 'magas', 'kötél', 'homlokzat', 'veszélyes'], // 9. Alpintechnikai
    ['zsindely', 'bitumenes', 'felrakás', 'karbantartás', 'ragasztás', 'tetőfedés', 'könnyű tető', 'OSB lap', 'cserép mintás'], // 10. Zsindelytetők
    ['fa', 'fémszerkezet', 'kocsibeálló', 'előtető', 'nyitott terasz', 'pergola', 'garázs', 'terasz', 'hegesztés', 'ácsmunka'], // 11. Fa- és fémszerkezetek
    ['kerti tároló', 'építmény', 'egyedi', 'faház', 'szerszámtároló', 'fészer', 'pavilon'], // 12. Kerti tárolók
    ['biztosítás', 'ügyintézés', 'kár', 'papírmunka', 'adminisztráció', 'kárrendezés', 'biztosító', 'dokumentáció', 'fotózás'], // 13. Biztosítási ügyek
    ['veszélyes', 'fa', 'kivágás', 'gallyazás', 'visszavágás', 'alpintechnika', 'kosaras', 'autó', 'ág', 'dőlés', 'korona']  // 14. Veszélyes fakivágás
  ],
  en: [
    ['roof', 'complete', 'new roof', 'construction', 'implementation', 'tile', 'roofing', 'carpentry'],
    ['storm', 'damage', 'restoration', 'repair', 'leak', 'urgent', 'SOS', 'wind', 'broken', 'torn'],
    ['flat roof', 'insulation', 'heavy plate', 'bitumen', 'leak-proof', 'insulator', 'roof insulation'],
    ['leak', 'water', 'seepage', 'spot', 'elimination', 'repair', 'detection', 'drip'],
    ['chimney', 'renovation', 'tinsmith', 'reconstruction', 'reinforcement', 'chimney flashing', 'chimney head', 'plastering', 'demolition'],
    ['old roof', 'restoration', 'monument', 'aged', 'reconstruction', 'corrugated sheet', 'renovation', 'relaying'],
    ['tinsmith', 'eaves', 'gutter', 'flashing', 'sheet', 'bending', 'drain', 'water drainage', 'zinc', 'aluminum'],
    ['fence', 'construction', 'renovation', 'woodwork', 'metal', 'wire', 'slatted', 'post', 'gate'],
    ['fascia board', 'eaves', 'repair', 'painting', 'wood protection', 'paneling', 'boarding', 'gable board', 'boxing'],
    ['alpine', 'technique', 'hard to reach', 'apartment building', 'high', 'rope', 'facade', 'dangerous'],
    ['shingle', 'bituminous', 'installation', 'maintenance', 'gluing', 'roofing', 'light roof', 'OSB board', 'patterned'],
    ['wood', 'metal structure', 'carport', 'canopy', 'open terrace', 'pergola', 'garage', 'terrace', 'welding', 'carpentry'],
    ['garden shed', 'structure', 'custom', 'wooden house', 'tool storage', 'shed', 'pavilion'],
    ['insurance', 'administration', 'damage', 'paperwork', 'claim', 'insurance company', 'documentation', 'photography'],
    ['dangerous', 'tree', 'removal', 'pruning', 'trimming', 'alpine technique', 'bucket truck', 'branch', 'falling', 'crown']
  ]
};

export default function Services() {
  const { t, language } = useLanguage();
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const icons = [
    Layers,           // 1. Teljes tetők
    Wind,             // 2. Vihar utáni károk
    Construction,     // 3. Lapos tetők
    Droplets,         // 4. Beázások
    Hammer,           // 5. Kémények
    Home,             // 6. Régi tetők
    ShieldCheck,      // 7. Bádogos munkák
    Fence,            // 8. Kerítések
    Paintbrush,       // 9. Széldeszka
    Wrench,           // 10. Alpintechnikai
    Ruler,            // 11. Zsindelytetők
    Trees,            // 12. Fa- és fémszerkezetek
    Home,             // 13. Kerti tárolók
    FileSignature,    // 14. Biztosítási ügyek
    Axe               // 15. Veszélyes fakivágás
  ];
  
  const services = useMemo(() => {
    return t.services.items.map((item, index) => ({
      ...item,
      icon: icons[index % icons.length],
      keywords: searchKeywords[language][index] || [],
      index
    }));
  }, [t.services.items, language]);

  const categoryGroups = {
    hu: [
      { name: "Tetőépítés és Felújítás", indices: [0, 5, 2, 10] },
      { name: "Javítás és Karbantartás", indices: [3, 1, 4, 8] },
      { name: "Kiegészítő és Kertépítési Munkák", indices: [6, 7, 11, 12] },
      { name: "Speciális Szolgáltatások", indices: [9, 13, 14] }
    ],
    en: [
      { name: "Roof Construction & Renovation", indices: [0, 5, 2, 10] },
      { name: "Repair & Maintenance", indices: [3, 1, 4, 8] },
      { name: "Complementary & Garden Works", indices: [6, 7, 11, 12] },
      { name: "Special Services", indices: [9, 13, 14] }
    ]
  };

  const currentCategories = categoryGroups[language];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/);
    
    return services
      .map(service => {
        let score = 0;
        const indexStr = `${service.title} ${service.description} ${service.keywords.join(' ')}`.toLowerCase();
        
        queryWords.forEach(word => {
          if (service.title.toLowerCase().includes(word)) score += 10;
          if (service.keywords.some(kw => kw.toLowerCase().includes(word))) score += 5;
          if (service.description.toLowerCase().includes(word)) score += 2;
        });
        
        return { service, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.service);
  }, [searchQuery, services]);

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-white scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-4">
            {t.services.badge}
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-dark">
            {t.services.title.split('{gradient}')[0]}
            <span className="text-gradient">{t.services.gradient}</span>
            {t.services.title.split('{gradient}')[1]}
          </h2>
          <p className="text-dark/60 max-w-2xl mx-auto mb-16 sm:mb-12">
            {t.services.description}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto z-20">
            {/* Playful Sticker */}
            <div className="absolute -top-14 sm:-top-16 right-2 sm:-right-12 md:-right-20 z-10 pointer-events-none transform rotate-[14deg] hover:rotate-[18deg] transition-transform duration-300 w-32 sm:w-auto">
              <div className="bg-yellow-300 shadow-lg px-3 py-2 sm:px-4 sm:py-3 max-w-[160px] rounded-sm flex flex-col items-center justify-center border border-yellow-400 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 bg-white/50 shadow-sm"></div>
                <span className="text-dark font-bold text-xs sm:text-sm leading-tight text-center">
                  {language === 'hu' ? 'Szolgáltatás keresés' : 'Search services'}
                </span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-1 text-dark/80 transform rotate-[100deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>

            <div className="relative flex items-center shadow-sm hover:shadow-md transition-shadow duration-300 rounded-full">
              <Search className="absolute left-6 text-dark/40 w-6 h-6 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hu' ? "Keresés" : "Search"}
                className="w-full pl-16 pr-28 py-5 rounded-full bg-black/5 border-2 border-transparent focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-lg placeholder:text-dark/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 px-4 py-2.5 text-sm font-bold text-dark/60 hover:text-red-600 bg-white shadow-sm border border-black/5 hover:border-red-200 hover:bg-red-50 transition-all rounded-full flex items-center gap-1.5"
                  title={language === 'hu' ? 'Keresés törlése' : 'Clear search'}
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === 'hu' ? 'Törlés' : 'Clear'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {searchQuery.trim() ? (
            <div className="animate-fade-in">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {searchResults.map((service) => (
                    <div 
                      key={service.title}
                      className="bg-gradient-to-br from-white to-black/[0.02] rounded-3xl p-6 flex flex-col items-start gap-4 transition-all duration-300 border border-primary/20 shadow-lg shadow-primary/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
                    >
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2 text-dark leading-tight">{service.title}</h4>
                        <p className="text-dark/60 text-sm md:text-base leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-6 bg-black/5 rounded-3xl border border-black/5">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-dark/20 shadow-sm border border-black/5">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    {language === 'hu' ? 'Nincs találat' : 'No results found'}
                  </h3>
                  <p className="text-dark/60">
                    {language === 'hu' 
                      ? 'Nincs olyan szolgáltatás, amely megfelelne a keresésnek. Kérjük, próbáljon más kulcsszavakat.' 
                      : 'No services match your search. Please try different keywords.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {currentCategories.map((category, catIndex) => {
                const isOpen = openCategory === catIndex;
                return (
                  <div 
                    key={category.name} 
                    className={cn(
                      "border rounded-3xl transition-all duration-300 overflow-hidden",
                      isOpen ? "bg-white shadow-xl border-primary/20 shadow-primary/5" : "bg-white/50 border-black/5 hover:border-primary/20 hover:bg-white hover:shadow-md"
                    )}
                  >
                    <button
                      onClick={() => setOpenCategory(isOpen ? null : catIndex)}
                      className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                    >
                      <h3 className={cn("text-xl md:text-2xl font-bold transition-colors", isOpen ? "text-primary" : "text-dark hover:text-primary")}>
                        {category.name}
                      </h3>
                      <div className={cn("w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors border", isOpen ? "bg-primary text-white border-primary" : "bg-black/5 text-dark/60 border-transparent group-hover:border-black/5")}>
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>
                    
                    <div 
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="p-6 md:p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white">
                          {category.indices.map((index) => {
                            const service = services[index];
                            return (
                              <div 
                                key={service.title}
                                className="bg-white rounded-2xl p-6 flex flex-col items-start gap-4 hover:bg-primary/5 transition-colors border border-black/5 hover:border-primary/20 hover:shadow-lg shadow-sm"
                              >
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                  <service.icon className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold mb-2 text-dark leading-tight">{service.title}</h4>
                                  <p className="text-dark/60 text-sm leading-relaxed">
                                    {service.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Extra CTA in Services as the last list item */}
          <div className="p-8 md:p-10 rounded-[32px] bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20 border-2 border-primary/20 flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl shadow-primary/5 mt-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-dark">{t.services.ctaTitle}</h3>
              <p className="text-dark/60 text-lg max-w-lg">{t.services.ctaDesc}</p>
            </div>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-dark transition-all whitespace-nowrap shrink-0 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {t.services.ctaButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

