import { useState, useEffect } from 'react';
import { Search, Users, X } from 'lucide-react';
import { getJury, BASE_URL } from '../utils/api';

interface JuryMember {
  id: string;
  name: string;
  role: string;
  org: string;
  tags: string[];
  photoUrl?: string;
  bg: string;
  initials: string;
}

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

export default function Jury() {
  const [searchQuery, setSearchQuery] = useState('');
  const [juryList, setJuryList] = useState<JuryMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<JuryMember | null>(null);

  const getFullUrl = (url: string | null) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${BASE_URL.replace('/api', '')}${url}`;
  };

  useEffect(() => {
    const fetchJury = async () => {
      try {
        setIsLoading(true);
        const res = await getJury();
        const mapped = (res.data || []).map((row: any) => {
          let tagsArray: string[] = [];
          if (row.tags) {
            try {
              tagsArray = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags;
            } catch (e) {}
          }
          return {
            id: row.id.toString(),
            name: row.name,
            role: row.role || 'Jury Member',
            org: row.org || '',
            tags: tagsArray,
            photoUrl: getFullUrl(row.photo_url),
            bg: row.bg_gradient || gradients[Math.floor(Math.random() * gradients.length)],
            initials: getInitials(row.name),
          };
        });
        setJuryList(mapped);
      } catch (err) {
        console.error("Failed to fetch jury members", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJury();
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

  const filteredJury = juryList.filter((j) => {
    const matchesSearch =
      j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.org.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="bg-[#f5fbf5] min-h-screen font-inter pb-16">
      {/* Header Area */}
      <header className="relative bg-dark-green py-20 px-6 overflow-hidden text-center border-b border-accent-gold/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,107,60,0.4),transparent)]"></div>
          <div className="absolute inset-0 heritage-ornament opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#2E7D32]/20 text-[#81C784] border border-[#2E7D32]/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <Users className="w-4 h-4" /> Valuation Board
          </div>
          <h1 className="text-pure-white text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-6">
            Jury of the Year
          </h1>
          <p className="text-pure-white/70 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Meet the distinguished experts, sustainability leaders, and policy makers evaluation panel of Greenpreneur Awards 2026.
          </p>

          <div className="relative max-w-2xl mx-auto shadow-2xl rounded-xl mt-8">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-medium-grey">
              <Search className="w-5 h-5 text-accent-gold" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, designation, or organization..."
              className="w-full bg-pure-white text-dark-text py-4 pl-14 pr-24 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-gold font-medium text-sm border border-light-grey"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-medium-grey hover:text-dark-text bg-light-grey/40 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Area */}
      <main className="py-16 px-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-light-grey shadow-sm">
            <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-medium-grey text-sm font-bold uppercase tracking-widest">Loading Jury Panel...</p>
          </div>
        ) : filteredJury.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-light-grey shadow-sm">
            <Users className="w-12 h-12 text-[#2E7D32]/40 mx-auto mb-4" />
            <p className="text-gray-500 text-sm mb-2">No jury members found matching your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#2E7D32] font-bold underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {filteredJury.filter(item => item.photoUrl).map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedPerson(item)}
                className="relative aspect-[3/4] rounded-[16px] overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100"
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

                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Text Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-white text-sm md:text-base font-bold leading-tight mb-1">{item.name}</h4>
                  <p className="text-white/80 text-[11px] md:text-xs leading-tight line-clamp-1">{item.role}</p>
                  <p className="text-white/50 text-[10px] md:text-[11px] leading-tight line-clamp-1 mt-0.5">{item.org}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal Overlay */}
      {selectedPerson && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPerson(null)}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPerson(null)}
              className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image */}
            <div className="aspect-[3/4] w-full relative bg-gray-100">
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
              
              {selectedPerson.tags.length > 0 && (
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
