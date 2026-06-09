import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Leaf, Award, Recycle, Trash2, Droplet, Zap, Wrench, Shield, Home, Building, User, Sparkles, Sprout, Globe, Rocket } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  desc: string;
  tag: string;
  icon: React.ComponentType<any>;
}

export default function AwardCategories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const mainCategories: Category[] = [
    { id: 1, name: 'Eco-Friendly Product', desc: 'Innovation in consumer or physical products with zero/low environment impact.', tag: 'Manufacturing', icon: Leaf },
    { id: 2, name: 'Sustainable Manufacturer', desc: 'Green manufacturing operations focusing on energy efficiency and low waste.', tag: 'Manufacturing', icon: Wrench },
    { id: 3, name: 'Sustainable Construction', desc: 'Green buildings, sustainable construction materials, and structures.', tag: 'Design', icon: Building },
    { id: 4, name: 'Architecture', desc: 'Sustainably planned architectural projects minimizing resource depletion.', tag: 'Design', icon: Home },
    { id: 5, name: 'Interior / Exterior Design', desc: 'Aesthetic design utilizing eco-friendly, circular, or upcycled materials.', tag: 'Design', icon: Sparkles },
    { id: 6, name: 'E-Vehicle Business', desc: 'Electric vehicles, charging infra, EV components, or zero-emission fleet services.', tag: 'Renewable', icon: Zap },
    { id: 7, name: 'Renewable Energy', desc: 'Solar, wind, biogas, bio-fuels, thermal energy, and conservation systems.', tag: 'Renewable', icon: Zap },
    { id: 8, name: 'Waste Management', desc: 'Systems and technologies for refuse segregation, collection, and safe processing.', tag: 'Waste', icon: Trash2 },
    { id: 9, name: 'Recycling', desc: 'Transforming waste materials into industrial or consumer-grade raw materials.', tag: 'Waste', icon: Recycle },
    { id: 10, name: 'Upcycling', desc: 'Creative transformation of waste byproducts into products of higher value.', tag: 'Waste', icon: Recycle },
    { id: 11, name: 'Water Conservation', desc: 'Rainwater harvesting, greywater treatment, desalination, and conservation tech.', tag: 'Agriculture', icon: Droplet },
    { id: 12, name: 'Sustainable Service Business', desc: 'Service-driven business operations optimized to support circular values.', tag: 'Services', icon: Shield },
    { id: 13, name: 'Sustainable Factory', desc: 'Industrial production houses powered by zero-waste and renewable utilities.', tag: 'Manufacturing', icon: Building },
    { id: 14, name: 'Sustainable Agriculture', desc: 'Organic farming, soil rehabilitation, micro-irrigation, and green agritech.', tag: 'Agriculture', icon: Sprout },
    { id: 15, name: 'Healthcare & Wellness', desc: 'Eco-friendly clinics, organic wellness products, and herbal healthcare.', tag: 'Services', icon: Leaf },
    { id: 16, name: 'Hospitality & Tourism', desc: 'Ecotourism ventures, organic homestays, and zero-waste resorts.', tag: 'Services', icon: Globe },
    { id: 17, name: 'Rural Development', desc: 'Grassroots projects empowering rural populations with green livelihoods.', tag: 'Social', icon: Sprout },
    { id: 18, name: 'Sustainable Education', desc: 'Educational modules, workshops, and courses promoting climate values.', tag: 'Social', icon: Award },
    { id: 19, name: 'Sustainable Campus', desc: 'Institutions or universities operating on strict zero-carbon standards.', tag: 'Design', icon: Building },
    { id: 20, name: 'Green Consulting & Services', desc: 'Carbon accounting, ESG audit, and eco-compliance consulting firms.', tag: 'Services', icon: Shield },
    { id: 21, name: 'Conservation & Restoration', desc: 'Afforestation, marine conservation, soil restoration, and wildlife protection.', tag: 'Agriculture', icon: Sprout },
    { id: 22, name: 'Clean Technology', desc: 'Advanced technical software or engineering for carbon footprint mitigation.', tag: 'Renewable', icon: Zap },
    { id: 23, name: 'Circular Economy', desc: 'Business models ensuring cradle-to-cradle lifecycle for materials.', tag: 'Waste', icon: Recycle },
    { id: 24, name: 'Sustainable Innovation', desc: 'Disruptive clean patents, chemistry breakthroughs, and green materials.', tag: 'Renewable', icon: Sparkles },
    { id: 25, name: 'Start-Up of the Year', desc: 'Sustainable ventures under 5 years showing exceptional scaling proof.', tag: 'Renewable', icon: Rocket },
    { id: 26, name: 'Social Impact Creator', desc: 'Enterprises prioritizing community development alongside green policies.', tag: 'Social', icon: User },
    { id: 27, name: 'NGO Impact Award', desc: 'Certified NGOs delivering measurable carbon-reduction or planting targets.', tag: 'Social', icon: Award },
    { id: 28, name: 'Corporate CSR in Green', desc: 'Best large corporate ESG campaigns showing positive carbon offset statistics.', tag: 'Services', icon: Building },
    { id: 29, name: 'Carbon Credit Pioneer', desc: 'Firms facilitating carbon trading, verification, and offsets.', tag: 'Services', icon: Shield },
    { id: 30, name: 'Biodiversity Champion', desc: 'Safeguarding natural habitats and diverse micro-flora/fauna.', tag: 'Agriculture', icon: Sprout },
    { id: 31, name: 'Sustainability Trend Setter', desc: 'Media houses, events, or fashion brands setting sustainable trends.', tag: 'Services', icon: Sparkles },
    { id: 32, name: 'Green Storyteller', desc: 'Writers, content creators, and documentarians highlighting climate struggles.', tag: 'Social', icon: Sprout },
    { id: 33, name: 'Net Zero Early Mover', desc: 'Pioneer businesses setting verified net-zero targets before industry averages.', tag: 'Renewable', icon: Shield },
    { id: 34, name: 'Sustainability Champion (Woman)', desc: 'Individual female leader breaking boundaries in the green economy.', tag: 'Champions', icon: User },
    { id: 35, name: 'Sustainability Champion (Man)', desc: 'Individual male leader paving paths in sustainable entrepreneurship.', tag: 'Champions', icon: User },
  ];

  const msmeCategories = [
    { title: 'Best Manufacturing MSME', desc: 'Excellence in production efficiency, eco-friendly materials, and green energy adoption.' },
    { title: 'Best Service-Based MSME', desc: 'Outstanding service models supporting resource reduction and circular values.' },
    { title: 'Innovative MSME of the Year', desc: 'Pioneering proprietary technologies and processes solving local eco-challenges.' },
    { title: 'Fastest Growing MSME', desc: 'Demonstrating hyper-growth and rapid scaling in sustainable product deliveries.' },
    { title: 'Sustainable MSME of the Year', desc: 'Holistic integration of social responsibility and environment management.' },
    { title: 'Best Woman-Led MSME', desc: 'Recognizing female founders steering successful sustainable small enterprises.' },
    { title: 'Social Impact MSME', desc: 'Bridging grassroots community employment and clean energy/recycling programs.' },
    { title: 'Best Export-Oriented MSME', desc: 'Indian sustainable products and innovations successfully reaching global markets.' },
    { title: 'Tech-Driven MSME of the Year', desc: 'Adopting AI, IoT, and clean software to monitor and reduce resource waste.' },
    { title: 'Young Entrepreneur MSME Award', desc: 'Recognizing founders under 30 leading green micro/small businesses.' },
  ];

  const filterTabs = ['All', 'Renewable', 'Manufacturing', 'Waste', 'Agriculture', 'Design', 'Services', 'Social', 'Champions'];

  const filteredCategories = mainCategories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || cat.tag === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col bg-pure-white min-h-screen">
      {/* Page Header */}
      <header className="relative bg-dark-green pt-20 pb-28 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 opacity-5 pointer-events-none -translate-x-1/2 -translate-y-1/2 bg-pure-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4 bg-pure-white rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-gold text-dark-green text-[10px] font-bold uppercase tracking-widest mb-6 shadow-lg">
            Recognising Excellence
          </span>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-pure-white mb-6 leading-tight">
            148+ Categories. <br />
            <span className="text-accent-gold">Find Yours.</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-green-100/70 max-w-2xl mx-auto font-inter">
            The Greenpreneur Awards cover every corner of the eco-economy. From innovation in energy to grassroots conservation, your impact belongs on our national stage.
          </p>
        </div>
      </header>

      {/* Search and Filters Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 w-full">
        <div className="bg-pure-white rounded-2xl shadow-xl p-6 border border-light-grey">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-medium-grey">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories (e.g. Solar, Waste, NGO...)"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-light-grey focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all text-sm"
              />
            </div>

            {/* Filter Tabs */}
            <div className="lg:col-span-7 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? 'bg-primary-green text-pure-white shadow-md'
                      : 'bg-cream-white text-medium-grey hover:bg-light-grey'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-dark-green mb-1">
              Primary Categories
            </h2>
            <p className="text-sm text-medium-grey">
              Browse categories matching your business sector.
            </p>
          </div>
          <div className="bg-cream-white border border-accent-gold/20 px-4 py-2 rounded-lg flex items-center gap-2 max-w-fit">
            <div className="w-2 h-2 bg-leaf-green rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-dark-green uppercase tracking-wider">
              {filteredCategories.length} Categories Listed
            </span>
          </div>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="bg-pure-white p-6 rounded-xl border border-light-grey shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-primary-green/10 flex items-center justify-center mb-6 text-primary-green group-hover:bg-primary-green group-hover:text-pure-white transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-dark-green mb-2 group-hover:text-primary-green transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-medium-grey leading-relaxed mb-6 font-light">
                      {cat.desc}
                    </p>
                  </div>
                  <Link
                    to="/awards/apply"
                    state={{ category: cat.name }}
                    className="w-full py-2.5 btn-premium-secondary"
                  >
                    Nominate Now
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-light-grey rounded-2xl">
            <p className="text-medium-grey text-sm">No categories found matching your query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('All');
              }}
              className="text-xs font-bold text-primary-green underline mt-2"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-12 text-center text-xs text-medium-grey italic">
          Can't find your exact category? Contact us — greenpreneur.in covers 148+ green sectors.
        </div>
      </main>

      {/* Special Segment: MSME Excellence Awards */}
      <section className="bg-dark-green py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
            <div className="lg:w-2/3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-accent-gold/20 text-accent-gold text-[10px] font-bold uppercase tracking-widest mb-4">
                Special Segment
              </span>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-pure-white mb-4">
                MSME Excellence Awards
              </h2>
              <p className="text-green-100/70 text-sm max-w-xl font-light">
                Honoring the micro, small, and medium businesses driving sustainability at local scale. 10 specialized MSME excellence categories are open.
              </p>
            </div>
            <div className="lg:w-1/3 flex lg:justify-end">
              <div className="bg-pure-white/5 border border-pure-white/10 backdrop-blur-xl px-6 py-4 rounded-xl text-center min-w-[120px]">
                <p className="text-accent-gold text-3xl font-bold mb-1">10</p>
                <p className="text-pure-white/60 text-[9px] font-bold uppercase tracking-widest">
                  MSME Tracks
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {msmeCategories.map((msme, idx) => (
              <div
                key={idx}
                className="bg-pure-white/5 border border-pure-white/10 p-5 rounded-xl flex flex-col justify-between hover:bg-pure-white/10 hover:border-accent-gold transition-all duration-300"
              >
                <div>
                  <Award className="w-5 h-5 text-accent-gold mb-3" />
                  <h4 className="text-pure-white font-bold text-xs leading-snug mb-2">
                    {msme.title}
                  </h4>
                  <p className="text-pure-white/60 text-[10px] leading-relaxed mb-4 font-light">
                    {msme.desc}
                  </p>
                </div>
                <Link
                  to="/awards/apply"
                  state={{ category: msme.title }}
                  className="text-accent-gold hover:text-pure-white text-[10px] font-bold uppercase tracking-wider mt-auto inline-flex items-center gap-1"
                >
                  Apply →
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/awards/apply"
              className="inline-block px-8 py-3 btn-premium-primary"
            >
              Apply for MSME Awards
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
