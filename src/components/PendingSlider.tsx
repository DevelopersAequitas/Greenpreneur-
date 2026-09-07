import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getPendingNominations, BASE_URL } from '../utils/api';
import type { PendingNominee } from '../utils/api';

const MOCK_NOMINEES: PendingNominee[] = [
  { 
    id: 101, 
    nominee_name: "Aarya Chavda", 
    category: "Changemakers of India", 
    profile_picture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80", 
    status: "pending" 
  },
  { 
    id: 102, 
    nominee_name: "Abhijit Dhondphale", 
    category: "Changemakers of India", 
    profile_picture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80", 
    status: "pending" 
  },
  { 
    id: 103, 
    nominee_name: "Ajaykumar J Patel", 
    category: "Greenpreneur Award", 
    profile_picture: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80", 
    status: "pending" 
  },
  { 
    id: 104, 
    nominee_name: "Akash Mistry", 
    category: "Top Green Social", 
    profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80", 
    status: "pending" 
  },
  { 
    id: 105, 
    nominee_name: "Amanat Kagzi", 
    category: "Greenpreneur Award", 
    profile_picture: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80", 
    status: "pending" 
  },
  { 
    id: 106, 
    nominee_name: "Ami Sshaah", 
    category: "Greenpreneur Award", 
    profile_picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80", 
    status: "pending" 
  },
  { 
    id: 107, 
    nominee_name: "Priya Mehta", 
    category: "Eco Innovation", 
    profile_picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80", 
    status: "pending" 
  },
  { 
    id: 108, 
    nominee_name: "Rohan Shah", 
    category: "Green Startup", 
    profile_picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80", 
    status: "pending" 
  },
];

export default function PendingSlider() {
  const [nominees, setNominees] = useState<PendingNominee[]>([]);
  const speed = 32; // Fixed normal scroll speed (32 seconds)

  useEffect(() => {
    async function fetchPending() {
      try {
        const res = await getPendingNominations();
        if (res.success && res.data && res.data.length > 0) {
          setNominees(res.data);
        } else {
          setNominees(MOCK_NOMINEES);
        }
      } catch (err) {
        console.error('Failed to fetch pending nominees:', err);
        setNominees(MOCK_NOMINEES);
      }
    }
    fetchPending();
  }, []);

  const getFullUrl = (url: string | null) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${BASE_URL.replace('/api', '')}${url}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Base list of nominees for display
  let baseList = [...nominees];

  // If there are fewer than 8 nominees, pad it with mock nominees to ensure standard length and smooth layout
  if (baseList.length > 0 && baseList.length < 8) {
    const diff = 8 - baseList.length;
    const additional = MOCK_NOMINEES.filter(
      (m) => !baseList.some((b) => b.nominee_name.toLowerCase() === m.nominee_name.toLowerCase())
    ).slice(0, diff);
    baseList = [...baseList, ...additional];
  }

  // Double the list to support seamless infinite loop translation (-50%)
  const doubledList = [...baseList, ...baseList];

  if (baseList.length === 0) return null;

  return (
    <section className="py-20 bg-cream-white relative overflow-hidden border-b border-light-grey">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 bg-[#e8f5ee] border border-[#9FE1CB] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F6E56] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse" />
            Nominations Live
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-dark-green mt-4 mb-3">
            Nominees of Greenpreneur 2027
          </h2>
          <p className="text-sm md:text-base text-medium-grey max-w-2xl font-inter">
            Scroll continuously to explore the trailblazers of Greenpreneur 2027. Hover over any nominee to pause and click to cast your vote!
          </p>
        </div>
      </div>

      {/* Marquee Track Container (Full Width) */}
      <div className="relative w-full overflow-hidden py-4 select-none animate-gp-scroll-pause">

        {/* Scrolling track */}
          <div 
            className="flex gap-6 animate-gp-scroll w-max"
            style={{ '--scroll-duration': `${speed}s` } as React.CSSProperties}
          >
            {doubledList.map((nominee, index) => {
              const uniqueKey = `${nominee.id}-${index}`;
              const initials = getInitials(nominee.nominee_name);
              const photoUrl = getFullUrl(nominee.profile_picture);
              const slug = getSlug(nominee.nominee_name);
              const cardIndex = (index % baseList.length) + 1;

              return (
                <Link
                  key={uniqueKey}
                  to={`/vote/${nominee.id}-${slug}`}
                  className="flex-shrink-0 w-64 h-[350px] bg-pure-white rounded-2xl overflow-hidden border border-light-grey/80 transition-all duration-300 hover:border-accent-gold/40 hover:shadow-gold-lux hover:-translate-y-1.5 group cursor-pointer"
                >
                  {/* Card Image Container */}
                  <div className="relative w-full h-[220px] overflow-hidden bg-dark-green">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={nominee.nominee_name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback to text initials if image fails to load
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.fallback-avatar');
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : null}

                    {/* Fallback Initials Avatar (renders if no image, or if image fails) */}
                    <div 
                      className={`fallback-avatar absolute inset-0 bg-gradient-to-br from-dark-green to-[#0b3e2b] flex flex-col items-center justify-center p-6 text-center ${
                        photoUrl ? 'hidden' : ''
                      }`}
                    >
                      <div className="w-20 h-20 rounded-full border border-accent-gold/30 flex items-center justify-center bg-dark-green shadow-inner mb-3">
                        <span className="font-playfair font-bold text-3xl text-gold-metallic">
                          {initials}
                        </span>
                      </div>
                      <span className="text-[10px] text-accent-gold font-bold uppercase tracking-widest font-inter">
                        Greenpreneur
                      </span>
                    </div>

                    {/* Card Index Badge */}
                    <div className="absolute top-3 right-3 bg-accent-gold text-pure-white font-extrabold text-xs w-7 h-7 rounded-full flex items-center justify-center shadow-lg border border-pure-white/10">
                      {cardIndex}
                    </div>
                  </div>

                  {/* Card Content Section */}
                  <div className="p-5 text-left bg-dark-green border-t border-accent-gold/20 flex flex-col justify-between h-[130px]">
                    <div>
                      <h3 className="font-inter font-bold text-pure-white text-base truncate group-hover:text-gold-metallic transition-colors" title={nominee.nominee_name}>
                        {nominee.nominee_name}
                      </h3>
                      <p className="text-[11px] text-[#9FE1CB] font-medium truncate mt-0.5" title={nominee.category}>
                        {nominee.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="inline-flex items-center gap-1.5 bg-indian-green/30 text-emerald-400 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Pending
                      </span>
                      <span className="text-gold-metallic group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

    </section>
  );
}
