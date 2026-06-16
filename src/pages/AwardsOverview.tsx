import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Check, TrendingUp, Search, Edit, Scale, Sparkles, Radio, BookOpen, Globe, Rocket, Users, X } from 'lucide-react';
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

export default function AwardsOverview() {
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
            role: row.role || 'Speakers & Jury Member',
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
  const steps = [
    {
      num: '01',
      title: 'Choose Category',
      desc: 'Select from 35+ award categories and MSME excellence tracks. Our scope spans over 148 sectors.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Submit Story',
      desc: 'Fill out our short nomination form. Standard nomination is completely FREE for the Honorary track.',
      icon: Edit,
    },
    {
      num: '03',
      title: 'Speakers & Jury Review',
      desc: 'Our panel of judges evaluates entries. Rated track nominees start public voting drives.',
      icon: Scale,
    },
    {
      num: '04',
      title: 'The Celebration',
      desc: 'Join us on 25th June 2026 at Renaissance by Marriott Ahmedabad to celebrate and receive your trophy.',
      icon: Sparkles,
    },
  ];

  const benefits = [
    {
      title: 'Media Authority',
      desc: 'Get featured on VyapaarJagat.com with a dedicated pictorial story, local SEO backlinks, and media promotions.',
      icon: Radio,
    },
    {
      title: 'Legacy Print Feature',
      desc: 'Secure a permanent page in the premium collector edition "Top 50 Sustainable Leaders" Coffee Table Book.',
      icon: BookOpen,
    },
    {
      title: 'Elite Business Network',
      desc: 'Gain permanent access to the Peers Global Business Network and the MEIF national community.',
      icon: Globe,
    },
  ];

  return (
    <div className="movement-bg font-inter text-dark-text antialiased">
      {/* Hero section */}
      <section className="relative bg-dark-green text-pure-white pt-24 pb-36 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,80 70,120 100,100 L100,0 L0,0 Z" fill="white"></path>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-pure-white/10 border border-pure-white/20 backdrop-blur-sm mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-leaf-green animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase">Nominations Open for 2026</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-playfair font-bold mb-6 leading-tight">
            The Journey to <br />
            <span className="text-accent-gold italic">Sustainability Leadership</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-pure-white/80 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Celebrate your structural impact. Showcase your green model on a national stage. Learn how our two distinct award tracks support businesses at all scales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#journey"
              className="px-8 py-4 btn-premium-primary"
            >
              Start Your Path
            </a>
            <a
              href="#tracks"
              className="px-8 py-4 btn-premium-secondary"
            >
              Compare Tracks
            </a>
          </div>
        </div>
      </section>

      {/* Two Tracks comparison cards */}
      <section id="tracks" className="py-20 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Honorary Card */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-green to-leaf-green rounded-2xl blur opacity-5 group-hover:opacity-25 transition duration-1000"></div>
              <div className="relative bg-pure-white p-10 rounded-2xl border border-primary-green/10 shadow-2xl flex flex-col justify-between h-full transform transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-4 right-4">
                  <div className="bg-primary-green text-pure-white px-5 py-1.5 rounded-full font-bold text-xs shadow-md border-2 border-pure-white">
                    FREE
                  </div>
                </div>
                <div>
                  <div className="w-16 h-16 bg-primary-green/10 rounded-2xl flex items-center justify-center mb-8">
                    <Award className="w-8 h-8 text-primary-green" />
                  </div>
                  <h3 className="text-3xl font-playfair font-bold text-dark-green mb-4">Honorary Track</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed text-sm font-light">
                    Honoring exceptional contribution and long-term legacy. Free to nominate. Best for lifetime contributors, corporate ESG leaders, and community organizers.
                  </p>
                  <div className="space-y-4 mb-8">
                    {[
                      '100% Expert Speakers & Jury Evaluation',
                      'Zero Registration/Nomination Fees',
                      'Free Business Profile Verification',
                      'Grand Felicitation at Marriott Ahmedabad',
                    ].map((bullet, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-leaf-green/10 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-leaf-green" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  to="/awards/apply"
                  className="w-full py-4 text-center btn-premium-primary"
                >
                  Nominate for Free
                </Link>
              </div>
            </div>

            {/* Rated Challenge Card */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-gold to-yellow-600 rounded-2xl blur opacity-5 group-hover:opacity-25 transition duration-1000"></div>
              <div className="relative bg-pure-white p-10 rounded-2xl border border-accent-gold/10 shadow-2xl flex flex-col justify-between h-full transform transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-4 right-4">
                  <div className="bg-accent-gold text-pure-white px-5 py-1.5 rounded-full font-bold text-xs shadow-md border-2 border-pure-white uppercase tracking-wider">
                    CHALLENGE
                  </div>
                </div>
                <div>
                  <div className="w-16 h-16 bg-accent-gold/10 rounded-2xl flex items-center justify-center mb-8">
                    <TrendingUp className="w-8 h-8 text-accent-gold" />
                  </div>
                  <h3 className="text-3xl font-playfair font-bold text-accent-gold mb-4">Rated Challenge</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed text-sm font-light">
                    Empower your network to validate your market leadership. Best for MSMEs, green startups, and scaling eco-friendly brands.
                  </p>
                  <div className="space-y-4 mb-8">
                    {[
                      '75% Speakers & Jury Weight + 25% Public Voting',
                      'Nominee Listed on Voting Platform',
                      'Personalized Creative Assets & Badge',
                      'VyapaarJagat Directory Lifetime Listing',
                    ].map((bullet, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-accent-gold" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  to="/awards/apply"
                  className="w-full py-4 text-center btn-premium-primary"
                >
                  Join Rated Challenge (From ₹2,000)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey process section */}
      <section id="journey" className="py-20 bg-pure-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary-green font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">
              Process Workflow
            </span>
            <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-dark-green mb-4">
              Your Road to the Stage
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto font-light">
              A transparent, supportive, 4-step selection journey designed for tier-2/3 business owners.
            </p>
          </div>

          <div className="relative">
            {/* Horizontal line for large screen */}
            <div className="hidden lg:block absolute top-28 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-primary-green/20 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center group">
                    <div className="w-32 h-32 rounded-full bg-cream-white border-4 border-pure-white shadow-lg flex items-center justify-center mb-6 relative group-hover:scale-105 transition-all duration-300">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-primary-green text-pure-white rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-pure-white">
                        {step.num}
                      </div>
                      <div className="p-5 bg-pure-white rounded-full shadow-inner">
                        <IconComponent className="w-8 h-8 text-primary-green" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-dark-green mb-2">{step.title}</h4>
                    <p className="text-sm font-semibold text-gray-800 leading-relaxed px-4">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The Value of Victory */}
      <section className="py-24 bg-dark-green text-pure-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-green rounded-full blur-[120px] opacity-10 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-gold rounded-full blur-[120px] opacity-10 -ml-48 -mb-48"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-4">The Value of Victory</h2>
            <p className="text-pure-white/60 text-sm max-w-xl mx-auto font-light">
              Winning a Greenpreneur award is an ongoing asset for your enterprise, providing marketing authority and community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={i}
                  className="bg-pure-white/5 p-8 rounded-xl border border-pure-white/10 hover:bg-pure-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-accent-gold/25 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-7 h-7 text-accent-gold" />
                  </div>
                  <h5 className="text-lg font-bold mb-3">{benefit.title}</h5>
                  <p className="text-xs text-pure-white/60 leading-relaxed font-light">
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Speakers & Jury Panel Section */}
      <section id="jury" className="py-20 bg-[#f5fbf5] border-t border-b border-light-grey">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary-green font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">
              Valuation Board
            </span>
            <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-dark-green mb-4">
              Speakers & Jury Panel 2026
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto font-light leading-relaxed">
              Meet the distinguished experts, sustainability leaders, and policy makers evaluation panel of Greenpreneur Awards 2026.
            </p>

            {/* Section Search Bar */}
            <div className="relative max-w-xl mx-auto shadow-md rounded-xl mt-8 border border-light-grey bg-pure-white">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-medium-grey">
                <Search className="w-5 h-5 text-accent-gold" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search panel by name, role, or organization..."
                className="w-full bg-transparent text-dark-text py-3.5 pl-12 pr-20 rounded-xl focus:outline-none font-medium text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-medium-grey hover:text-dark-text bg-light-grey/40 px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-light-grey shadow-sm">
              <div className="w-10 h-10 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-medium-grey text-[10px] font-bold uppercase tracking-widest">Loading Panel...</p>
            </div>
          ) : filteredJury.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-light-grey shadow-sm">
              <Users className="w-10 h-10 text-[#2E7D32]/40 mx-auto mb-4" />
              <p className="text-gray-500 text-xs mb-2">No speakers or jury members found matching your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-[#2E7D32] font-bold underline"
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
                  {/* Photo */}
                  <img src={item.photoUrl!} alt={item.name} className="w-full h-full object-cover" />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Text Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white text-xs md:text-sm font-bold leading-tight mb-1">{item.name}</h4>
                    <p className="text-white/80 text-[10px] md:text-xs leading-tight line-clamp-1">{item.role}</p>
                    <p className="text-white/50 text-[9px] md:text-[10px] leading-tight line-clamp-1 mt-0.5">{item.org}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Overlay */}
        {selectedPerson && (
          <div 
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedPerson(null)}
          >
            <div 
              className="bg-white w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPerson(null)}
                className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-[3/4] w-full relative bg-gray-100">
                <img src={selectedPerson.photoUrl} alt={selectedPerson.name} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-gray-900 mb-1">{selectedPerson.name}</h3>
                <p className="text-xs font-bold text-[#2E7D32] mb-1">{selectedPerson.role}</p>
                <p className="text-xs text-gray-500 mb-5 font-medium">{selectedPerson.org}</p>
                
                {selectedPerson.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedPerson.tags.map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-[#E8F5E9] text-[#1a5c1a] border border-[#C8E6C9] rounded-full text-[10px] font-semibold"
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
      </section>

      {/* Will You Be Our Next Greenpreneur CTA box */}
      <section className="py-24 bg-cream-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-pure-white p-12 sm:p-20 rounded-3xl shadow-xl border border-light-grey text-center relative overflow-hidden group">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary-green/5 rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent-gold/5 rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-dark-green mb-6">
                Will You Be Our Next <br />
                <span className="text-primary-green italic">Greenpreneur?</span>
              </h2>
              <p className="text-base text-gray-500 mb-10 font-light leading-relaxed max-w-xl mx-auto">
                Your sustainable operations deserve to be recognized on a national stage. Submitting your entry is simple, mobile-friendly, and free for the Honorary Track.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/awards/apply"
                  className="px-8 py-4 btn-premium-primary"
                >
                  Apply Now <Rocket className="w-4 h-4" />
                </Link>
                <Link
                  to="/event-2026"
                  className="px-8 py-4 btn-premium-secondary"
                >
                  Get Your Pass
                </Link>
              </div>
              
              <div className="mt-10 flex flex-wrap justify-center gap-6 text-[10px] text-medium-grey uppercase tracking-widest font-semibold opacity-60">
                <span>5th Annual Event</span>
                <span>•</span>
                <span>35+ Award Categories</span>
                <span>•</span>
                <span>1,000 Green Stories</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
