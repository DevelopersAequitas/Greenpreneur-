import { Award, Users, Globe, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppPromo from '../components/AppPromo';

export default function About() {
  const previousEditions = [
    {
      year: '2026',
      location: 'Renaissance by Marriott, Ahmedabad',
      theme: 'Sustainability in Viksit Bharat @2047',
      desc: 'Celebrated our 5th Anniversary honoring 100+ green pioneers and launching the official Coffee Table Book.',
    },
    {
      year: '2025',
      location: 'BSE India, Mumbai',
      theme: 'Scaling Circular Green Economies',
      desc: 'Partnered with central sustainability chambers, felicitating 85+ green pioneers with national broadcast coverage.',
    },
    {
      year: '2024',
      location: 'AMA Ahmedabad',
      theme: 'MSME & Grassroots Green Tech',
      desc: 'Brought together 400+ delegates in Gujarat, focusing heavily on retail green product lines and green manufacturing practices.',
    },
    {
      year: '2023',
      location: 'CEE (Centre for Environment Education), Ahmedabad',
      theme: 'Climate Action & Sustainable Habitats',
      desc: 'Aligned directly with national environmental educators, evaluating innovations in eco-tourism and organic farming.',
    },
    {
      year: '2022',
      location: 'VyapaarJagat Digital Conclave',
      theme: 'Post-Pandemic Green Turnaround',
      desc: 'An intensive virtual convention celebrating resource resilience, green supply chain shifts, and early waste startups.',
    },
  ];

  return (
    <div className="bg-cream-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-dark-green text-pure-white py-24 px-6 overflow-hidden text-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&w=1920&q=80&fit=crop"
            alt="Forest Mountains Landscape"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-green/90 via-dark-green to-dark-green"></div>
          <div className="absolute inset-0 heritage-ornament opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Our Legacy
          </div>
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold mb-6">
            The Greenpreneur Story
          </h1>
          <p className="text-pure-white/70 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Celebrating 5 years of identifying, amplifying, and scaling India's most innovative green business leaders.
          </p>
        </div>
      </section>

      {/* CORE STATS BANNER */}
      <section className="py-8 bg-pure-white border-y border-light-grey">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="block text-3xl sm:text-4xl font-playfair font-bold text-accent-gold">5th</span>
            <span className="text-[10px] text-medium-grey font-bold uppercase tracking-widest mt-1 block">
              Annual Edition
            </span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-playfair font-bold text-primary-green">1,000+</span>
            <span className="text-[10px] text-medium-grey font-bold uppercase tracking-widest mt-1 block">
              Stories Published
            </span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-playfair font-bold text-accent-gold">150+</span>
            <span className="text-[10px] text-medium-grey font-bold uppercase tracking-widest mt-1 block">
              Sectors Vetted
            </span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-playfair font-bold text-primary-green">5,000+</span>
            <span className="text-[10px] text-medium-grey font-bold uppercase tracking-widest mt-1 block">
              Community Members
            </span>
          </div>
        </div>
      </section>

      {/* THE VISION & ORGANIZERS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Main Context */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-accent-gold font-bold uppercase tracking-[0.3em] text-[10px] block">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-dark-green leading-tight">
              A Noble Movement Driven by Passion & Sustainability
            </h2>
            <p className="text-gray-600 leading-relaxed font-light text-sm sm:text-base">
              Greenpreneur is not just an award program; it is India's premier network of sustainability-focused business architects. In 2027, we celebrate our <strong>6th year anniversary celebration</strong> at the Renaissance by Marriott Ahmedabad Hotel.
            </p>
            <p className="text-gray-600 leading-relaxed font-light text-sm sm:text-base">
              The platform was born from a simple realization: while traditional business awards focus purely on financial top-lines, our environment requires a system that rewards resource efficiency, carbon consciousness, and circular economic principles. Greenpreneur fills this gap by validating green businesses through a structured, multi-tier Speakers & jury audit.
            </p>
            <p className="text-gray-600 leading-relaxed font-light text-sm sm:text-base">
              Over the years, we have brought together innovators in waste management, renewable fuels, organic farming, sustainable textiles, and electric vehicles, creating opportunities for them to meet investors, corporate buyers, and policymakers.
            </p>

            {/* SDG list */}
            <div className="bg-pure-white p-6 rounded-xl border border-light-grey mt-8">
              <h4 className="font-bold text-dark-green text-base mb-3">Our Core Objectives:</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                  <span><strong>Celebrate Excellence:</strong> Felicitating those who demonstrate measurable environmental stewardship.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
                  <span><strong>Build Networks:</strong> Bridging the gap between green MSMEs and corporate ESG buying teams.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                  <span><strong>Amplify Voice:</strong> Generating national visibility for sustainability stories via VyapaarJagat.com.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Organizer Cards */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {/* NGO info */}
            <div className="bg-pure-white p-8 rounded-xl border border-light-grey shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-green text-pure-white rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-accent-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-green text-lg">MEIF</h3>
                  <span className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">
                    NGO Organizer
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                <strong>1 Million Entrepreneurs International Forum (MEIF)</strong> is a registered Section 8 Company in India (NGO) with active <strong>80G & 12A</strong> certifications. They are fully certified under CSR (CSR00106194) and NITI Aayog Darpan to implement impactful national development initiatives.
              </p>
              <div className="text-[10px] border-t border-light-grey pt-3 text-medium-grey flex justify-between">
                <span>PAN: AACCZ1279M</span>
                <span>Founding Dir: Dr. Pravin Parmar</span>
              </div>
            </div>

            {/* Media Partner Info */}
            <div className="bg-pure-white p-8 rounded-xl border border-light-grey shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-dark-green text-pure-white rounded-lg flex items-center justify-center">
                  <Globe className="w-7 h-7 text-accent-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-green text-lg">VyapaarJagat.com</h3>
                  <span className="text-[10px] text-primary-green font-bold uppercase tracking-wider">
                    Media & Tech Partner
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                VyapaarJagat.com is one of India's leading business platforms documenting entrepreneur stories. It serves as the primary media engine for Greenpreneur, archiving and publishing editorial features on sustainable businesses to drive organic growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APP PROMO FLOW BREAK */}
      <AppPromo 
        title="Your Green Network on the Go" 
        subtitle="Greenpreneur Mobile Experience" 
        description="Stay connected to the Greenpreneur network. Manage your profile, view upcoming events, and access directories anywhere." 
        integrationFocus={false} 
      />

      {/* TIMELINE OF PREVIOUS EDITIONS */}
      <section className="py-24 bg-pure-white border-y border-light-grey">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-accent-gold font-bold uppercase tracking-[0.5em] text-[10px] mb-4 block">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-dark-green">
              Chronicles of Sustainability
            </h2>
            <p className="text-xs sm:text-sm text-medium-grey max-w-xl mx-auto mt-2 font-light">
              Greenpreneur has travelled across key institutional backings, celebrating changes in diverse business centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {previousEditions.map((ed, i) => (
              <div
                key={i}
                className="bg-cream-white p-6 border border-light-grey rounded-lg relative group hover:border-accent-gold transition-all"
              >
                <span className="block text-4xl font-playfair font-bold text-accent-gold mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  {ed.year}
                </span>
                <span className="text-[10px] uppercase font-bold text-primary-green tracking-wider block mb-1">
                  {ed.location}
                </span>
                <h4 className="font-bold text-sm text-dark-green mb-3">{ed.theme}</h4>
                <p className="text-xs text-medium-grey leading-relaxed font-light">{ed.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP / FOUNDER MESSAGE */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-dark-green text-pure-white rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 heritage-ornament opacity-5"></div>
          <div className="grid lg:grid-cols-12 items-center gap-12 p-8 sm:p-16 relative z-10">
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 border-2 border-accent-gold/30 rounded-full"></div>
                <div className="w-48 h-48 rounded-full border-4 border-accent-gold shadow-lg overflow-hidden bg-white">
                  <img
                    src="/pravin.png"
                    alt="Dr. Pravin Parmar"
                    className="w-full h-full object-cover scale-[1.7] origin-[50%_40%]"
                  />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <span className="text-accent-gold text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
                Founder's Vision
              </span>
              <h3 className="text-2xl sm:text-3xl font-playfair font-bold mb-6">
                Dr. Pravin Parmar
              </h3>
              <p className="text-pure-white/80 text-sm sm:text-base leading-relaxed mb-6 font-light italic">
                "Our vision is clear: we want to create a collaborative network where sustainable start-ups and established MSMEs don't operate in silos. By sharing stories and validating carbon-efficient models, we align Indian enterprise with the national agenda of Viksit Bharat @2047. Greenpreneur is a dedication to our future generations."
              </p>
              <div className="flex flex-col text-xs text-pure-white/40">
                <span className="font-bold text-pure-white">Founder, MEIF & VyapaarJagat.com</span>
                <span>Organiser of Greenpreneur Mega Events</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-16 bg-dark-green text-pure-white text-center relative overflow-hidden">
        <div className="absolute inset-0 lotus-pattern opacity-10"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="font-playfair text-3xl font-bold mb-4 text-pure-white">
            Be part of the 5th Year Celebration Event.
          </h2>
          <p className="text-pure-white/80 text-sm mb-8 font-light max-w-lg mx-auto">
            Nominate your business for free or secure a delegate pass to network with 500+ green leaders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/awards/apply"
              className="btn-premium-primary px-8 py-3.5 text-xs"
            >
              Nominate Now (FREE)
            </Link>
            <Link
              to="/event-2027"
              className="btn-premium-secondary px-8 py-3.5 text-xs text-pure-white border-pure-white hover:text-dark-green"
            >
              Get Event Pass
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
