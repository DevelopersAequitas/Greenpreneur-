import { useState, useEffect } from 'react';
import { X, Award, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// -- Mock Data Types & Constants --
type TabType = 'winners' | 'sponsors' | 'partners' | 'jury';

interface PersonData {
  id: string;
  initials: string;
  name: string;
  role: string;
  org: string;
  tags: string[];
  bg: string;
  photoUrl?: string; // Optional real photo URL
  rank?: string;
  tier?: string;
}

const SECTION_LABELS: Record<TabType, string> = {
  winners: 'Category Winners',
  sponsors: 'Our Sponsors',
  partners: 'Partner Organisations',
  jury: 'Jury of the Year'
};

import { getWinners, getGallerySponsors, getPartners, getJury, BASE_URL } from '../utils/api';

const gradients = [
  'linear-gradient(160deg,#5a9a6a,#3d7a50)',
  'linear-gradient(160deg,#4a8a90,#2d6a70)',
  'linear-gradient(160deg,#7a9a60,#5a7a44)',
  'linear-gradient(160deg,#5a8a70,#3a6a52)',
  'linear-gradient(160deg,#2a3a7a,#1a2a6a)',
  'linear-gradient(160deg,#8a3a9a,#5a1a7a)',
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function HallOfGreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('winners');
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null);
  const [dbData, setDbData] = useState<Record<TabType, PersonData[]>>({
    winners: [],
    sponsors: [],
    partners: [],
    jury: []
  });

  const getFullUrl = (url: string | null) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${BASE_URL.replace('/api', '')}${url}`;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [wRes, sRes, pRes, jRes] = await Promise.all([
          getWinners({}, 20),
          getGallerySponsors(),
          getPartners(),
          getJury()
        ]);

        const formatPerson = (row: any, roleDef: string): PersonData => {
          let tagsArray: string[] = [];
          if (row.tags) {
            try { tagsArray = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags; } catch (e) {}
          } else if (row.category) {
            tagsArray = [row.category, row.city].filter(Boolean) as string[];
          }

          return {
            id: row.id.toString(),
            initials: getInitials(row.name),
            name: row.name,
            role: row.role || roleDef,
            org: row.org || row.company || '',
            tags: tagsArray,
            photoUrl: getFullUrl(row.photo_url),
            bg: row.bg_gradient || gradients[Math.floor(Math.random() * gradients.length)]
          };
        };

        setDbData({
          winners: (wRes.data || []).map(row => formatPerson(row, row.category || 'Winner')),
          sponsors: (sRes.data || []).map(row => formatPerson(row, 'Sponsor')),
          partners: (pRes.data || []).map(row => formatPerson(row, 'Partner')),
          jury: (jRes.data || []).map(row => formatPerson(row, 'Jury Member'))
        });

      } catch (err) {
        console.error('Failed to fetch gallery data', err);
      }
    };
    fetchAllData();
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedPerson) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPerson]);

  const items = dbData[activeTab];

  // Routing config for the CTA button based on active tab
  const getCtaConfig = () => {
    switch (activeTab) {
      case 'winners': return { label: 'View All Winners', path: '/winners' };
      case 'sponsors': return { label: 'View All Sponsors', path: '/sponsors/opportunities' };
      case 'partners': return { label: 'View All Partners', path: '/partners' };
      case 'jury': return { label: 'View All Jury', path: '/jury' };
      default: return { label: 'Load More', path: '/' };
    }
  };

  const cta = getCtaConfig();

  const handleRedirect = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(cta.path);
  };

  return (
    <section className="bg-[#f5fbf5] py-16 font-inter">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <Award className="w-4 h-4" /> Greenpreneur Awards 2026
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-dark-green mb-4 tracking-tight">Hall of Green</h2>
          <p className="text-gray-600 max-w-lg mx-auto text-sm md:text-base">
            Honouring the visionaries, sustainability architects, and key enablers behind India's green entrepreneurship movement.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {(['winners', 'sponsors', 'partners', 'jury'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            const emoji = tab === 'winners' ? '🏆' : tab === 'sponsors' ? '🤝' : tab === 'partners' ? '🌐' : '⚖️';
            const count = dbData[tab].filter(item => item.photoUrl).length;
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
                  isActive 
                    ? 'bg-dark-green text-white border-dark-green shadow-md scale-105' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{emoji}</span>
                <span className="capitalize">{tab}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider Label */}
        <div className="flex items-center gap-4 max-w-[1020px] mx-auto mb-8">
          <div className="h-px bg-[#C8E6C9] flex-1"></div>
          <span className="text-[#2E7D32] text-xs font-bold uppercase tracking-widest">{SECTION_LABELS[activeTab]}</span>
          <div className="h-px bg-[#C8E6C9] flex-1"></div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 max-w-[1020px] mx-auto">
          {items.filter(item => item.photoUrl).slice(0, 6).map((item) => {
            // Determine Badge logic
            let Badge = null;
            if (activeTab === 'partners') {
              const shortRole = item.role.replace(' Partner', '');
              Badge = (
                <div className="absolute top-2 right-2 z-10 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black/50 text-white shadow-md backdrop-blur-sm border border-white/10">
                  {shortRole}
                </div>
              );
            }

            return (
              <div 
                key={item.id}
                onClick={() => setSelectedPerson(item)}
                className="relative aspect-[3/4] rounded-[16px] overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gray-100"
              >
                {/* Photo or Fallback Gradient */}
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-4xl font-black text-white/90"
                    style={{ background: item.bg }}
                  >
                    {item.initials}
                  </div>
                )}

                {Badge}

                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Text Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-white text-xs md:text-sm font-bold leading-tight mb-0.5">{item.name}</h4>
                  <p className="text-white/70 text-[10px] md:text-xs leading-tight line-clamp-1">{item.role}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button 
            onClick={handleRedirect}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-dark-green text-white font-bold rounded-full hover:bg-indian-green hover:shadow-lg transition-all duration-300 group"
          >
            {cta.label}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Detail Modal Overlay */}
      {selectedPerson && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPerson(null)}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPerson(null)}
              className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image/Header */}
            <div className="aspect-[3/4] w-full relative">
              {selectedPerson.photoUrl ? (
                <img src={selectedPerson.photoUrl} alt={selectedPerson.name} className="w-full h-full object-cover" />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-7xl font-black text-white/90 shadow-inner"
                  style={{ background: selectedPerson.bg }}
                >
                  {selectedPerson.initials}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h3 className="text-2xl font-black text-gray-900 mb-1">{selectedPerson.name}</h3>
              <p className="text-sm font-bold text-[#2E7D32] mb-1">{selectedPerson.role}</p>
              <p className="text-sm text-gray-500 mb-5 font-medium">{selectedPerson.org}</p>
              
              <div className="flex flex-wrap gap-2">
                {selectedPerson.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 bg-[#E8F5E9] text-[#1a5c1a] border border-[#C8E6C9] rounded-full text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
