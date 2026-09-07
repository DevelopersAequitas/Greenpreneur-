import React, { useState } from 'react';
import { Search, Info, Trophy, Calendar, Handshake, BookOpen, ChevronDown, MessageCircle, Mail, ShieldCheck, History, Users2, Megaphone } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  category: 'general' | 'awards' | 'event' | 'sponsorship' | 'coffee-table-book';
  isCrucial?: boolean;
}

export default function FAQs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>('honorary-vs-rated');

  const categories = [
    { id: 'all', name: 'All Categories', icon: <Info className="w-4 h-4" /> },
    { id: 'general', name: 'General', icon: <Info className="w-4 h-4" /> },
    { id: 'awards', name: 'Awards & Nominations', icon: <Trophy className="w-4 h-4" /> },
    { id: 'event', name: 'Event Details', icon: <Calendar className="w-4 h-4" /> },
    { id: 'sponsorship', name: 'Sponsorship', icon: <Handshake className="w-4 h-4" /> },
    { id: 'coffee-table-book', name: 'Coffee Table Book', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const faqData: FAQItem[] = [
    // General
    {
      id: 'what-is-greenpreneur',
      question: 'What is Greenpreneur?',
      answer: "Greenpreneur is India's most comprehensive green entrepreneurship platform. It is a structured, high-impact annual event now in its 6th Year (2027). The movement celebrates and supports entrepreneurs redefining sustainability across 150+ sectors.",
      category: 'general',
    },
    {
      id: 'who-is-organiser',
      question: 'Who is the organiser?',
      answer: (
        <span>
          Greenpreneur is organised by <strong>1 Million Entrepreneurs International Forum (MEIF)</strong>, a Section 8 NGO, and powered by <strong>VyapaarJagat.com</strong>. It was founded by Dr. Pravin Parmar.
        </span>
      ),
      category: 'general',
    },
    {
      id: 'what-is-1meif',
      question: 'What is MEIF?',
      answer: '1 Million Entrepreneurs International Forum is a Section 8 Company (NGO) with 80G & 12A certification. They are CSR & Darpan certified, focusing on empowering entrepreneurs across India.',
      category: 'general',
    },
    {
      id: 'what-is-ceed',
      question: 'What is CEED?',
      answer: 'CEED (Culinary Education & Enterprise Development Association) is our Association Partner, founded by Shri Anil Mulchandani and IFEA Founders. They bring expertise in sustainable growth and industry collaboration.',
      category: 'general',
    },
    {
      id: 'what-is-vyapaarjagat',
      question: 'What is VyapaarJagat and why is my story published there?',
      answer: "VyapaarJagat.com is one of India's leading platforms for entrepreneur stories. Publishing your story here provides you with national visibility, 3rd party credibility, and a digital footprint that helps in SEO and business networking.",
      category: 'general',
    },
    // Awards
    {
      id: 'honorary-vs-rated',
      question: 'Honorary vs Rated Awards?',
      answer: (
        <div className="grid sm:grid-cols-2 gap-4 mt-2">
          <div className="bg-pure-white p-4 rounded-lg border border-light-grey">
            <h5 className="font-bold text-primary-green mb-1 flex items-center gap-1.5 text-sm">
              <Trophy className="w-4 h-4 text-accent-gold" />
              Honorary Awards
            </h5>
            <p className="text-xs text-medium-grey">
              100% Speakers & jury evaluated. <strong>FREE</strong> to nominate. For exceptional lifetime or sector contributions. Vetted strictly by merit.
            </p>
          </div>
          <div className="bg-accent-gold/5 p-4 rounded-lg border border-accent-gold/20">
            <h5 className="font-bold text-accent-gold mb-1 flex items-center gap-1.5 text-sm">
              <Megaphone className="w-4 h-4" />
              Rated Challenge
            </h5>
            <p className="text-xs text-medium-grey">
              75% Speakers & jury + 25% Public Voting. Nominal fee (₹2,000 to ₹5,000) for premium marketing creatives, voting link, and editorial support.
            </p>
          </div>
        </div>
      ),
      category: 'awards',
      isCrucial: true,
    },
    {
      id: 'is-nomination-free',
      question: 'Is nomination really free?',
      answer: (
        <span>
          <strong>YES!</strong> Nomination is always FREE for the Honorary track. We believe every green effort deserves a chance to be seen. Nominal charges only apply if you choose the Rated Challenge track for premium benefits and public voting features.
        </span>
      ),
      category: 'awards',
    },
    {
      id: 'what-are-categories',
      question: 'What are the award categories?',
      answer: 'We have 35+ main categories including Eco-Friendly Product, Sustainable Construction, Renewable Energy, Waste Management, and MSME Excellence Awards. A total of 148+ sub-sectors are covered.',
      category: 'awards',
    },
    {
      id: 'who-can-apply',
      question: 'Who can apply?',
      answer: 'Any entrepreneur, startup, MSME, NGO, or professional working in sustainability-focused sectors (150+ categories) can apply. This includes renewable energy, waste management, organic farming, green building, and more.',
      category: 'awards',
    },
    {
      id: 'what-winner-receives',
      question: 'What does a winner receive?',
      answer: 'Winners receive a prestigious Trophy, Certificate of Excellence, stage felicitation at a 5-star venue, national media coverage, inclusion in the Coffee Table Book, and a full pictorial story on VyapaarJagat.com.',
      category: 'awards',
    },
    {
      id: 'how-public-voting-works',
      question: 'How does public voting work?',
      answer: 'For the Rated Challenge, once nominated, you receive a personalised voting link and social media creatives. Your network can vote for you online. This constitutes 25% of your final score, with the remaining 75% coming from our expert Speakers & jury.',
      category: 'awards',
    },
    // Event
    {
      id: 'when-is-event',
      question: 'When is the event?',
      answer: (
        <span>
          The Greenpreneur 2027 Mega Event will take place on <strong>Friday, 25th June 2027</strong>, from 2:00 PM to 9:30 PM.
        </span>
      ),
      category: 'event',
    },
    {
      id: 'where-is-event',
      question: 'Where is the event?',
      answer: (
        <span>
          The venue is the prestigious <strong>Renaissance by Marriott Ahmedabad Hotel</strong>, Gujarat, India.
        </span>
      ),
      category: 'event',
    },
    {
      id: 'how-to-register',
      question: 'How do I register as a delegate?',
      answer: 'You can register through our "Get Pass" button on the website. Delegate passes include access to panel discussions, networking sessions, award ceremony, and gala dinner.',
      category: 'event',
    },
    {
      id: 'can-exhibit',
      question: 'Can I exhibit at the event?',
      answer: 'Yes! We have 25+ exhibition stalls available. We offer two sizes: Standard (6x6 ft) and Premium (10x10 ft). Please contact Vishal Parmar (+91 70411 51714) for pricing and booking.',
      category: 'event',
    },
    {
      id: 'can-speak',
      question: 'Can I speak or lead a masterclass?',
      answer: 'We are always looking for expert speakers in the green economy. You can apply through our Secretariat. Selection is based on expertise, impact, and relevance to our 2027 theme: "Sustainability in Viksit Bharat".',
      category: 'event',
    },
    // Sponsorship
    {
      id: 'how-to-sponsor',
      question: 'How can I become a sponsor?',
      answer: 'We offer several tiers from ₹10,000 (Category Sponsor) to ₹2,00,000 (Title Sponsor). Benefits include naming rights, stage branding, attendee data, speaking slots, and premium features in the Coffee Table Book. Contact Vishal Parmar to discuss the right fit for your brand.',
      category: 'sponsorship',
    },
    // Coffee Table Book
    {
      id: 'how-to-featured-book',
      question: 'How can I get featured in the Coffee Table Book?',
      answer: 'You can apply for an "Inside Feature Story" starting at ₹5,000 (Members) to ₹15,000 (Open). Ad slots and cover stories are also available. This book features the Top 50 Sustainable Leaders of India.',
      category: 'coffee-table-book',
    },
    {
      id: 'how-many-copies',
      question: 'How many copies of the Coffee Table Book are printed?',
      answer: 'We print 5,000 premium physical copies distributed to industry leaders, government offices, and delegates. Additionally, it has a digital reach of over 5,00,000 sustainable enthusiasts.',
      category: 'coffee-table-book',
    },
    {
      id: 'gst-on-pricing',
      question: 'Is there GST on Coffee Table Book pricing?',
      answer: 'No, GST is not applicable on the current pricing for Greenpreneur 2027.',
      category: 'coffee-table-book',
    },
  ];

  // Filter items
  const filteredFaqs = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-cream-white min-h-screen">
      {/* HEADER HERO */}
      <header className="relative bg-dark-green py-20 px-6 overflow-hidden text-center border-b border-accent-gold/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,107,60,0.4),transparent)]"></div>
          <div className="absolute inset-0 heritage-ornament opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent-gold/25 text-accent-gold border border-accent-gold/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Support Center
          </div>
          <h1 className="text-pure-white text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-6">
            How Can We Help You?
          </h1>
          <p className="text-pure-white/70 text-base sm:text-lg font-light mb-10 max-w-2xl mx-auto">
            Everything you need to know about India's most comprehensive green entrepreneurship platform.
          </p>

          {/* SEARCH BAR */}
          <div className="relative max-w-2xl mx-auto shadow-2xl rounded-xl">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-medium-grey">
              <Search className="w-5 h-5 text-accent-gold" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for questions like 'nomination fee', 'event date'..."
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

      {/* CATEGORY NAV AND ACCORDION LIST */}
      <main className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar Nav Categories */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28 bg-pure-white p-6 border border-light-grey rounded-xl shadow-sm">
              <h3 className="text-dark-green text-sm uppercase tracking-widest font-bold mb-6 border-b border-light-grey pb-3">
                Help Categories
              </h3>
              <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap min-w-max lg:min-w-0 ${
                        isActive
                          ? 'bg-primary-green text-pure-white shadow-md'
                          : 'text-medium-grey hover:bg-cream-white/70 hover:text-dark-green'
                      }`}
                    >
                      {cat.icon}
                      {cat.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Accordion List */}
          <div className="lg:col-span-9 space-y-12">
            <div>
              <h2 className="text-2xl font-playfair font-bold text-dark-green mb-6 capitalize">
                {selectedCategory === 'all' ? 'All Frequently Asked Questions' : `${selectedCategory.replace('-', ' ')} FAQs`}
              </h2>

              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 bg-pure-white rounded-xl border border-light-grey">
                  <p className="text-medium-grey text-sm mb-2">No matching questions found.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-xs text-primary-green font-bold underline"
                  >
                    Reset filters & search
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => {
                    const isOpen = openId === faq.id;
                    const isCrucial = faq.isCrucial;

                    return (
                      <div
                        key={faq.id}
                        className={`border rounded-xl bg-pure-white transition-all overflow-hidden ${
                          isOpen
                            ? isCrucial
                              ? 'border-accent-gold shadow-md ring-2 ring-accent-gold/10'
                              : 'border-primary-green shadow-sm'
                            : 'border-light-grey hover:border-medium-grey/40 hover:shadow-sm'
                        }`}
                      >
                        <button
                          onClick={() => toggleAccordion(faq.id)}
                          className="w-full text-left p-6 flex items-center justify-between text-base font-bold text-dark-green select-none"
                        >
                          <div className="flex items-center gap-3">
                            {isCrucial && (
                              <span className="bg-accent-gold text-pure-white text-[12px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                                Crucial
                              </span>
                            )}
                            <span className="text-sm sm:text-base">{faq.question}</span>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-primary-green shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {/* Smooth collapse container */}
                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            isOpen ? 'max-h-[1000px] border-t border-light-grey/50 p-6' : 'max-h-0 overflow-hidden'
                          }`}
                        >
                          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* SUPPORT CALL TO ACTION SECTION */}
      <section className="bg-dark-green py-20 px-6 relative overflow-hidden border-t-4 border-accent-gold">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pure-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-green/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-pure-white text-3xl sm:text-4xl font-playfair font-bold mb-6 leading-tight">
              Can't find what you're looking for?
            </h2>
            <p className="text-pure-white/70 text-sm sm:text-base mb-10 leading-relaxed font-light">
              Our secretariat is dedicated to supporting India's green movement. If you have any specific query, need help nominating your startup, or want to discuss sponsorships, reach out directly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="https://wa.me/917041151714?text=Hi,%20I'm%20having%20some%20queries%20about%20Greenpreneur%202027"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-pure-white px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <a
                href="mailto:hello@greenpreneur.in"
                className="inline-flex items-center justify-center gap-3 bg-pure-white/10 text-pure-white px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest border border-pure-white/20 hover:bg-pure-white/20 transition-all"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
            </div>
            <p className="text-pure-white/40 text-xs">
              Typical response time: <span className="text-pure-white font-semibold">Under 2 hours</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-pure-white/5 border border-pure-white/10 p-6 rounded-xl group hover:bg-pure-white/10 transition-all cursor-default">
              <div className="w-12 h-12 bg-accent-gold text-pure-white rounded-lg flex items-center justify-center mb-4 shadow-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-accent-gold text-[10px] font-bold uppercase tracking-widest mb-1">Authenticity</p>
              <p className="text-pure-white font-bold text-lg mb-1 tracking-tight">NGO Certified</p>
              <p className="text-pure-white/50 text-xs font-light">CSR00106194 | 80G & 12A Verified</p>
            </div>

            <div className="bg-pure-white/5 border border-pure-white/10 p-6 rounded-xl group hover:bg-pure-white/10 transition-all cursor-default">
              <div className="w-12 h-12 bg-primary-green text-pure-white rounded-lg flex items-center justify-center mb-4 shadow-xl">
                <History className="w-6 h-6" />
              </div>
              <p className="text-accent-gold text-[10px] font-bold uppercase tracking-widest mb-1">Legacy</p>
              <p className="text-pure-white font-bold text-lg mb-1 tracking-tight">5th Year</p>
              <p className="text-pure-white/50 text-xs font-light">Celebrating half a decade of excellence</p>
            </div>

            <div className="bg-pure-white/5 border border-pure-white/10 p-6 rounded-xl group hover:bg-pure-white/10 transition-all cursor-default">
              <div className="w-12 h-12 bg-pure-white/10 text-pure-white rounded-lg flex items-center justify-center mb-4 shadow-xl border border-pure-white/10">
                <Users2 className="w-6 h-6 text-accent-gold" />
              </div>
              <p className="text-accent-gold text-[10px] font-bold uppercase tracking-widest mb-1">Community</p>
              <p className="text-pure-white font-bold text-lg mb-1 tracking-tight">500+ Leaders</p>
              <p className="text-pure-white/50 text-xs font-light">Gathering at Renaissance Ahmedabad</p>
            </div>

            <div className="bg-pure-white/5 border border-pure-white/10 p-6 rounded-xl group hover:bg-pure-white/10 transition-all cursor-default">
              <div className="w-12 h-12 bg-accent-gold text-pure-white rounded-lg flex items-center justify-center mb-4 shadow-xl">
                <Megaphone className="w-6 h-6" />
              </div>
              <p className="text-accent-gold text-[10px] font-bold uppercase tracking-widest mb-1">Amplify</p>
              <p className="text-pure-white font-bold text-lg mb-1 tracking-tight">1,000+ Stories</p>
              <p className="text-pure-white/50 text-xs font-light">Nationwide digital recognition</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
