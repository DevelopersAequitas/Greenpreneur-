import { useState, useEffect } from 'react';
import { Award, Search, Tag, MapPin, Star, ExternalLink, Loader2, X } from 'lucide-react';
import { getWinners, ASSETS_BASE_URL } from '../utils/api';

interface Winner {
  id: number;
  name: string;
  company: string;
  category: string;
  city: string;
  year: string;
  image: string;
  impact: string;
  quote: string;
  link: string;
}

export default function Winners() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [winnersData, setWinnersData] = useState<Winner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);
  const limit = 9;

  const fetchWinners = async (currentOffset: number, reset: boolean = false) => {
    try {
      if (reset) setIsLoading(true);
      else setLoadingMore(true);

      const filters = {
        category: selectedCat !== 'all' ? selectedCat : undefined,
      };
      
      const res = await getWinners(filters, limit, currentOffset);
      const mapped = (res.data || []).map((w: any) => ({
        id: w.id,
        name: w.name,
        company: w.company,
        category: w.category,
        city: w.city,
        year: w.award_year,
        image: w.photo_url ? (w.photo_url.startsWith('http') ? w.photo_url : `${ASSETS_BASE_URL}${w.photo_url}`) : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
        impact: w.impact_text,
        quote: w.quote || '',
        link: w.website_link || null,
      }));

      if (reset) {
        setWinnersData(mapped);
      } else {
        setWinnersData(prev => [...prev, ...mapped]);
      }
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to fetch winners", err);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    fetchWinners(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCat]);

  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchWinners(nextOffset, false);
  };

  const categories = [
    'all',
    'Waste Management',
    'Sustainable Manufacturer',
    'Sustainable Agriculture',
    'Renewable Energy',
    'Eco-Friendly Product',
    'Sustainable Construction',
    'E-Vehicle Business',
  ];

  // Client-side search filter (since we only fetch by category from backend for now)
  const filteredWinners = winnersData.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.impact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const hasMore = winnersData.length < total;

  return (
    <div className="bg-cream-white min-h-screen">
      <header className="relative bg-dark-green py-20 px-6 overflow-hidden text-center border-b border-accent-gold/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,107,60,0.4),transparent)]"></div>
          <div className="absolute inset-0 heritage-ornament opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent-gold/25 text-accent-gold border border-accent-gold/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Hall of Fame
          </div>
          <h1 className="text-pure-white text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-6">
            Past Award Winners
          </h1>
          <p className="text-pure-white/70 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Honouring the sustainability architects, circular visionaries, and green business pioneers of India.
          </p>

          <div className="relative max-w-2xl mx-auto shadow-2xl rounded-xl mt-8">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-medium-grey">
              <Search className="w-5 h-5 text-accent-gold" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by winner name, company, or tech impact..."
              className="w-full bg-pure-white text-dark-text py-5 pl-14 pr-24 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-gold font-medium text-sm border border-light-grey"
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

      <main className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-end gap-6 mb-12 bg-pure-white p-6 rounded-xl border border-light-grey shadow-sm">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold text-dark-green uppercase flex items-center gap-1.5 mr-2">
              <Tag className="w-4 h-4 text-accent-gold" />
              Sector:
            </span>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="px-4 py-2 bg-cream-white border border-light-grey rounded text-xs font-bold text-dark-green focus:outline-none focus:ring-1 focus:ring-accent-gold min-w-[200px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'all' ? 'all' : cat.toLowerCase().replace(/ /g, '-')}>
                  {cat === 'all' ? 'All Sectors' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-pure-white rounded-xl border border-light-grey shadow-sm">
            <Loader2 className="w-12 h-12 text-primary-green animate-spin mb-4" />
            <p className="text-medium-grey text-sm font-bold uppercase tracking-widest">Loading Winners...</p>
          </div>
        ) : filteredWinners.length === 0 ? (
          <div className="text-center py-20 bg-pure-white rounded-xl border border-light-grey shadow-sm">
            <Award className="w-12 h-12 text-accent-gold/40 mx-auto mb-4" />
            <p className="text-medium-grey text-sm mb-2">No past winners found matching these criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCat('all');
              }}
              className="text-xs text-primary-green font-bold underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredWinners.map((winner) => (
                <div
                  key={winner.id}
                  onClick={() => setSelectedWinner(winner)}
                  className="bg-pure-white border border-light-grey rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-accent-gold cursor-pointer"
                >
                  <div>
                    <div className="relative h-72 overflow-hidden bg-cream-white border-b border-light-grey">
                      <img
                        src={winner.image}
                        alt={winner.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-[10px] text-accent-gold font-bold uppercase tracking-widest block mb-1.5">
                          {winner.category}
                        </span>
                        <h4 className="font-playfair text-dark-green text-xl font-bold leading-snug">
                          {winner.name}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light line-clamp-3">
                        {winner.impact}
                      </p>

                      {winner.quote && (
                        <div className="bg-cream-white/70 p-4 rounded-lg border-l-4 border-accent-gold italic text-[11px] leading-relaxed text-gray-500 font-light line-clamp-2">
                          "{winner.quote}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-light-grey/40 mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary-green uppercase tracking-widest flex items-center gap-1">
                      Speakers & Jury Verified
                    </span>
                    {winner.link && (
                      <span className="text-[10px] font-bold text-medium-grey hover:text-accent-gold uppercase tracking-widest flex items-center gap-1 transition-colors">
                        Read Story
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {hasMore && !searchQuery && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-dark-green text-pure-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary-green transition-all flex items-center gap-2 mx-auto disabled:opacity-70"
                >
                  {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loadingMore ? 'Loading...' : 'Load More Winners'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Detail Modal Overlay */}
      {selectedWinner && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedWinner(null)}
        >
          <div 
            className="bg-pure-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedWinner(null)}
              className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/50 hover:bg-black/80 text-pure-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scrollable container for modal */}
            <div className="overflow-y-auto w-full">
              {/* Modal Image/Header */}
              <div className="h-[360px] sm:h-[420px] w-full relative bg-dark-green overflow-hidden">
                <img src={selectedWinner.image} alt={selectedWinner.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-20 pointer-events-none"></div>
                
                <div className="absolute bottom-6 left-6 right-6 text-pure-white z-30">
                  <span className="text-[10px] text-accent-gold font-bold uppercase tracking-widest block mb-2">
                    {selectedWinner.category}
                  </span>
                  <h3 className="text-2xl font-bold leading-tight font-playfair">{selectedWinner.name}</h3>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-4 text-xs">
                  {selectedWinner.company && (
                    <div className="flex items-center gap-1.5 font-bold text-dark-green">
                      <Star className="w-4 h-4 text-accent-gold fill-accent-gold" />
                      <span>{selectedWinner.company}</span>
                    </div>
                  )}
                  {selectedWinner.city && (
                    <div className="flex items-center gap-1.5 text-medium-grey font-light">
                      <MapPin className="w-4 h-4 text-accent-gold" />
                      <span>{selectedWinner.city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-medium-grey font-light">
                    <Award className="w-4 h-4 text-accent-gold" />
                    <span>Edition {selectedWinner.year}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-dark-green uppercase tracking-widest border-b border-light-grey pb-2">
                    Impact & Achievements
                  </h4>
                  <p className="text-sm text-dark-text leading-relaxed font-light whitespace-pre-line">
                    {selectedWinner.impact}
                  </p>
                </div>

                {selectedWinner.quote && (
                  <div className="bg-cream-white p-5 rounded-xl border-l-4 border-accent-gold italic text-xs leading-relaxed text-gray-500 font-light shadow-sm">
                    "{selectedWinner.quote}"
                  </div>
                )}

                {/* Footer/CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-light-grey/60">
                  <span className="text-[10px] font-bold text-primary-green uppercase tracking-widest flex items-center gap-1">
                    Speakers & Jury Verified
                  </span>
                  {selectedWinner.link && (
                    <a
                      href={selectedWinner.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2 bg-accent-gold text-pure-white text-xs font-bold uppercase tracking-wider rounded hover:bg-dark-green transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      Read Full Story
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
