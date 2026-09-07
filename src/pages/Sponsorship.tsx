import { useState, useEffect } from 'react';
import { Award, Users, Shield, TrendingUp, Handshake, Mail, CheckCircle, Store, X } from 'lucide-react';
import { submitSponsorshipEnquiry, getGallerySponsors, BASE_URL } from '../utils/api';

export default function Sponsorship() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    tier: 'Title Sponsor (₹2,00,000)',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sponsorsList, setSponsorsList] = useState<any[]>([]);
  const [isLoadingSponsors, setIsLoadingSponsors] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedPerson) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPerson]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setIsLoadingSponsors(true);
        const res = await getGallerySponsors();
        const list = res.data || [];
        const tierPriority: Record<string, number> = {
          'Title Sponsor': 1,
          'Platinum Sponsor': 2,
          'Powered By': 3,
          'Gold Sponsor': 4,
          'Associate Partner': 5,
          'Organized by': 6,
          'Technology Partner': 7,
          'Media Partner': 8
        };
        const sortedSponsorNames = [
          'Broghar Realty',
          'Armorfire',
          'Aerolam',
          'Porcious',
          'Sun Wave Energy',
          'CampusDean',
          'CampusJobs.ai',
          'Nature Coat',
          'Zybra',
          'CEED',
          'TVM',
          'Shaadi Vows',
          'Wide Reach',
          'Fempreneur',
          '1 Million',
          'Peers Global',
          'Aequitas Infotech',
          'VyapaarJagat.com'
        ];
        const sorted = [...list].sort((a, b) => {
          const idxA = sortedSponsorNames.indexOf(a.name);
          const idxB = sortedSponsorNames.indexOf(b.name);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          const pA = tierPriority[a.role] || 99;
          const pB = tierPriority[b.role] || 99;
          if (pA !== pB) return pA - pB;
          return a.name.localeCompare(b.name);
        });
        setSponsorsList(sorted);
      } catch (err) {
        console.error("Failed to fetch sponsors", err);
      } finally {
        setIsLoadingSponsors(false);
      }
    };
    fetchSponsors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.company && formData.email && formData.phone) {
      setIsSubmitting(true);
      try {
        const res = await submitSponsorshipEnquiry(formData);
        
        if (res.data && (res.data as any).amount) {
          const { createPaymentOrder } = await import('../utils/api');
          const { initiateRazorpayPayment } = await import('../utils/razorpay');
          
          const orderRes = await createPaymentOrder({
            amount: (res.data as any).amount,
            receipt: `sponsorship_${(res.data as any).id}`,
            notes: {
              module: 'sponsorships',
              record_id: String((res.data as any).id),
            },
          });

          console.log('Create order response:', {
            success: orderRes?.success,
            orderId: orderRes?.order?.id,
            keyIdPrefix: orderRes?.key_id?.substring(0, 8),
          });

          if (!orderRes?.success || !orderRes?.order?.id || !orderRes?.key_id) {
            throw new Error('Invalid order response from server: Missing order ID or key ID');
          }

          initiateRazorpayPayment(
            {
              key_id: orderRes.key_id,
              order_id: orderRes.order.id,
              amount: (res.data as any).amount,
              name: formData.name,
              description: `Sponsorship: ${formData.tier}`,
              prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
              },
              module: 'sponsorships',
              record_id: (res.data as any).id,
            },
            () => setSubmitted(true),
            (err) => alert(err.message || 'Payment failed or cancelled.')
          );
        } else {
          setSubmitted(true);
        }
      } catch (err: any) {
        alert(err.message || 'Enquiry failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const values = [
    { title: 'Brand Visibility', desc: 'Logo presence on all digital and offline promotional collaterals, backdrops, and folders.', icon: Shield },
    { title: 'Elite Networking', desc: 'Direct engagement with 500+ attendees including decision-makers and policy authorities.', icon: Users },
    { title: 'ESG Positioning', desc: 'Demonstrate alignment with UN SDGs and Viksit Bharat @2047 on a national stage.', icon: Handshake },
    { title: 'Measurable Leads', desc: 'Structured data access to attendee demographics and matching sector profiles.', icon: TrendingUp },
  ];

  const tiers = [
    {
      title: 'Title Sponsor',
      price: '₹2,00,000',
      badge: 'Elite Tier',
      tagline: 'Presented by Your Brand',
      benefits: [
        'Exclusive Event Naming Rights: Presented By logo lockup',
        'Logo placement on ALL main backdrops, brochures, trophies',
        'Keynote speaking slot (15 mins) during main summit',
        'Full post-event attendee insights and matching logs',
        'Premium full-page feature story in Coffee Table Book',
        'Featured logo in all media drives on VyapaarJagat.com',
      ],
      isPopular: true,
    },
    {
      title: 'Powered By',
      price: '₹1,00,000',
      badge: 'Premium Co-Branding',
      tagline: 'Co-Branding Stage BACKDROP',
      benefits: [
        'Co-branding logotype placement on main stage backdrop',
        'Speaking slot during panel discussions (8-10 mins)',
        'Full page feature profile story in Coffee Table Book',
        'Featured logo on event registration page and email updates',
        'Story integration on VyapaarJagat.com channels',
      ],
      isPopular: false,
    },
    {
      title: 'Platinum Sponsor',
      price: '₹75,000',
      badge: 'Major Sponsor',
      tagline: 'High Impact Positioning',
      benefits: [
        'Large logo placement on all offline standees and banners',
        'On-stage logo branding slide during award presentation',
        'VIP delegate passes (6) including premium gala dinner seats',
        'Full-page advertisement in Coffee Table Book',
      ],
      isPopular: false,
    },
    {
      title: 'Gold Sponsor',
      price: '₹50,000',
      badge: 'Tier 2 Sponsor',
      tagline: 'Essential Recognition',
      benefits: [
        'Medium logo placement on promotional marketing collaterals',
        'Selected stage branding mentions during awards',
        'VIP delegate passes (4) with dinners included',
        'Half-page print profile in Coffee Table Book',
      ],
      isPopular: false,
    },
    {
      title: 'Silver Sponsor',
      price: '₹25,000',
      badge: 'Tier 3 Sponsor',
      tagline: 'Strategic Alignment',
      benefits: [
        'Standard logo placement on banners and official website',
        'VIP delegate passes (2) with dinners included',
        'Quarter-page advertisement in Coffee Table Book',
      ],
      isPopular: false,
    },
    {
      title: 'Category Sponsor',
      price: '₹10,000',
      badge: 'Niche Segment',
      tagline: 'Niche Category Specific Focus',
      benefits: [
        'Logo printed directly on the category trophy and certificate',
        'Brand announcement during specific award felicitation',
        'Standard delegate passes (2) with dinners included',
      ],
      isPopular: false,
    },
  ];

  const stalls = [
    {
      type: 'Standard Stall',
      size: '6 × 6 ft',
      price: 'Contact Vishal Parmar',
      includes: [
        '1 table and 2 chairs',
        'Standard backdrop system',
        'Power connection points',
        '2 general event entry passes',
      ],
    },
    {
      type: 'Premium Stall',
      size: '10 × 10 ft',
      price: 'Contact Vishal Parmar',
      includes: [
        '2 tables and 4 chairs',
        'Premium banner setup + backdrop space',
        'Dedicated spotlights and power systems',
        '4 general passes + 1 VIP pass',
      ],
    },
  ];

  return (
    <div className="font-inter text-dark-text bg-cream-white min-h-screen">
      {/* Banner */}
      <header className="bg-dark-green py-24 px-6 text-pure-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
            alt="Conclave"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-green via-dark-green/90 to-dark-green"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pure-white/10 border border-pure-white/20 text-accent-gold text-xs font-bold tracking-widest uppercase mb-6">
            Partnerships 2027
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6 leading-tight">
            Be a Part of India's Green Economy Movement
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-pure-white/70 max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Highlight your organization's environmental values and build business relations with 500+ green entrepreneurs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#tiers"
              className="px-6 py-3 btn-premium-primary"
            >
              Explore Tiers
            </a>
            <a
              href="#contact"
              className="px-6 py-3 btn-premium-secondary"
            >
              Request Proposal
            </a>
          </div>
        </div>
      </header>

      {/* Dynamic Sponsors Section */}
      <section className="py-16 px-6 bg-pure-white border-b border-light-grey">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-accent-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">
              Our Supporters
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-dark-green">
              Event Sponsors & Partners 2027
            </h2>
            <div className="w-12 h-0.5 bg-accent-gold mx-auto mt-3"></div>
          </div>

          {isLoadingSponsors ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs text-medium-grey font-semibold tracking-wider uppercase animate-pulse">Loading Sponsors...</p>
            </div>
          ) : sponsorsList.length === 0 ? (
            <p className="text-center text-xs text-medium-grey py-6">Become our first sponsor. Enquire below!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {sponsorsList.map((item) => {
                const photoUrl = item.photo_url
                  ? item.photo_url.startsWith('http')
                    ? item.photo_url
                    : `${BASE_URL.replace('/api', '')}${item.photo_url}`
                  : undefined;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPerson(item)}
                    className="relative rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 bg-white border border-gray-100 flex flex-col justify-between cursor-pointer group"
                  >
                    {/* Logo container with white bg */}
                    <div className="aspect-[4/3] bg-white flex items-center justify-center p-6 relative">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white rounded-lg bg-dark-green/10 text-dark-green">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      
                      {/* Role/Tier Badge */}
                      <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider bg-accent-gold/15 text-accent-gold border border-accent-gold/25 px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                        {item.role}
                      </span>
                    </div>

                    {/* Footer text */}
                    <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                      <h4 className="text-gray-800 text-xs font-bold truncate">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Detail Modal Overlay */}
          {selectedPerson && (() => {
            let tagsArray: string[] = [];
            if (selectedPerson.tags) {
              try {
                tagsArray = typeof selectedPerson.tags === 'string'
                  ? JSON.parse(selectedPerson.tags)
                  : selectedPerson.tags;
              } catch (e) {}
            }
            return (
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
                  <div className="aspect-[3/4] w-full relative bg-white flex items-center justify-center p-8">
                    {selectedPerson.photo_url ? (
                      <img 
                        src={
                          selectedPerson.photo_url.startsWith('http')
                            ? selectedPerson.photo_url
                            : `${BASE_URL.replace('/api', '')}${selectedPerson.photo_url}`
                        } 
                        alt={selectedPerson.name} 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-7xl font-black text-white/90 shadow-inner bg-dark-green/10 text-dark-green">
                        {selectedPerson.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Modal Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{selectedPerson.name}</h3>
                    <p className="text-sm font-bold text-[#2E7D32] mb-1">{selectedPerson.role}</p>
                    <p className="text-sm text-gray-500 mb-5 font-medium">{selectedPerson.org || selectedPerson.company || ''}</p>
                    
                    {tagsArray.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tagsArray.map((tag, idx) => (
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
            );
          })()}
        </div>
      </section>

      {/* Value proposition */}
      <section className="py-20 px-6 bg-pure-white border-b border-light-grey">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-accent-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">
                The Value Proposition
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-playfair text-dark-green">
                Why Partner with Greenpreneur?
              </h2>
            </div>
            <p className="text-sm text-medium-grey max-w-sm font-light">
              Position your brand at the center of the sustainability dialogue and connect with the pioneers of India's green future.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="group border border-light-grey p-6 rounded-2xl bg-cream-white/50 hover:bg-pure-white transition-all shadow-sm">
                  <div className="w-12 h-12 bg-primary-green/10 text-primary-green rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-green group-hover:text-pure-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-dark-green mb-2">{v.title}</h3>
                  <p className="text-xs text-medium-grey leading-relaxed font-light">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers Grid */}
      <section id="tiers" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">
              Investment Options
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-playfair text-dark-green">
              Select Your Impact Level
            </h2>
            <div className="w-16 h-0.5 bg-accent-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`bg-pure-white p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-md relative ${
                  tier.isPopular ? 'border-2 border-accent-gold' : 'border-light-grey'
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 bg-accent-gold text-pure-white px-4 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase">
                    {tier.badge}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold font-playfair text-dark-green mb-1">
                    {tier.title}
                  </h3>
                  <span className="text-[10px] text-medium-grey block uppercase tracking-wider mb-4">
                    {tier.tagline}
                  </span>
                  <div className="flex items-baseline gap-1.5 mb-6 pb-4 border-b border-light-grey">
                    <span className="text-4xl font-bold font-playfair text-primary-green">
                      {tier.price}
                    </span>
                    <span className="text-[10px] text-medium-grey uppercase font-semibold">
                      INR Investment
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                        <Award className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#contact"
                  onClick={() => setFormData((p) => ({ ...p, tier: `${tier.title} (${tier.price})` }))}
                  className="w-full py-3 btn-premium-primary text-center"
                >
                  Enquire Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibition Stalls */}
      <section className="py-20 px-6 bg-pure-white border-t border-light-grey">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-accent-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">
              Showcase Space
            </span>
            <h2 className="text-3xl font-playfair font-bold text-dark-green">Exhibition Stalls</h2>
            <p className="text-xs text-medium-grey mt-2 max-w-md mx-auto">
              Exhibit your eco-friendly products and solutions to 500+ delegates. Stalls are limited.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stalls.map((stall, i) => (
              <div key={i} className="bg-cream-white p-8 rounded-2xl border border-light-grey shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-light-grey">
                    <h3 className="font-bold text-lg text-dark-green flex items-center gap-2">
                      <Store className="w-5 h-5 text-primary-green" /> {stall.type}
                    </h3>
                    <span className="text-xs font-bold text-accent-gold bg-accent-gold/10 px-3 py-1 rounded-full">
                      Size: {stall.size}
                    </span>
                  </div>
                  <ul className="space-y-2.5 mb-6 text-xs text-gray-700">
                    {stall.includes.map((inc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-green" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="#contact"
                  className="w-full py-2.5 btn-premium-secondary text-center"
                >
                  Book Stall space
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate enquiry form */}
      <section id="contact" className="py-20 px-6 bg-cream-white border-t border-light-grey">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2 bg-dark-green p-10 rounded-3xl text-pure-white">
              <span className="text-accent-gold font-bold uppercase tracking-widest text-[10px] block mb-2">
                Secure Your Tier
              </span>
              <h3 className="font-playfair text-3xl font-bold mb-4">Corporate Enquiry</h3>
              <p className="text-xs text-pure-white/70 leading-relaxed mb-10">
                Let's discuss how we can customize our sponsorship options to deliver maximum value for your brand and support your ESG targets.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pure-white/10 flex items-center justify-center text-accent-gold shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[12px] uppercase tracking-widest text-pure-white/40 block">
                      Partnership Lead
                    </span>
                    <span className="font-bold text-sm block">Vishal Parmar (Director)</span>
                    <span className="text-xs text-pure-white/70">+91 70411 51714</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pure-white/10 flex items-center justify-center text-accent-gold shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[12px] uppercase tracking-widest text-pure-white/40 block">
                      Enquiry Email
                    </span>
                    <a
                      href="mailto:hello@greenpreneur.in"
                      className="font-bold text-sm block hover:underline"
                    >
                      hello@greenpreneur.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-pure-white p-8 sm:p-12 rounded-3xl border border-light-grey shadow-md">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary-green/10 text-primary-green rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-dark-green text-lg mb-1">Proposal Requested!</h4>
                    <p className="text-xs text-medium-grey px-4 leading-relaxed">
                      Thank you, <strong>{formData.name}</strong>. Your inquiry for <strong>{formData.company}</strong> regarding the <strong>{formData.tier}</strong> has been received. Our Partnership Director, Vishal Parmar, will call you on <strong>{formData.phone}</strong> shortly to share detailed proposals.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[12px] font-bold uppercase tracking-wider text-medium-grey block mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-cream-white/50 border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green focus:bg-pure-white"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-bold uppercase tracking-wider text-medium-grey block mb-1">
                          Organization / Company
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-cream-white/50 border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green focus:bg-pure-white"
                          placeholder="Your Company Ltd"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[12px] font-bold uppercase tracking-wider text-medium-grey block mb-1">
                          Work Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-cream-white/50 border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green focus:bg-pure-white"
                          placeholder="john@company.com"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-bold uppercase tracking-wider text-medium-grey block mb-1">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-cream-white/50 border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green focus:bg-pure-white"
                          placeholder="+91 70411 51714"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[12px] font-bold uppercase tracking-wider text-medium-grey block mb-1">
                        Sponsorship Tier of Interest
                      </label>
                      <select
                        value={formData.tier}
                        onChange={(e) => setFormData((p) => ({ ...p, tier: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-cream-white/50 border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green"
                      >
                        <option>Title Sponsor (₹2,00,000)</option>
                        <option>Powered By (₹1,00,000)</option>
                        <option>Platinum Sponsor (₹75,000)</option>
                        <option>Gold Sponsor (₹50,000)</option>
                        <option>Silver Sponsor (₹25,000)</option>
                        <option>Category Sponsor (₹10,000)</option>
                        <option>Exhibition Stall only</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[12px] font-bold uppercase tracking-wider text-medium-grey block mb-1">
                        Additional Requirements
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-cream-white/50 border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green focus:bg-pure-white resize-none"
                        placeholder="Tell us about your brand's promotional goals..."
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 btn-premium-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Submitting...' : 'Request Proposal'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
