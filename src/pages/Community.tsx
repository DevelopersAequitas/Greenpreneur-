import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { submitCommunityApplication } from '../utils/api';

export default function Community() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    company: '',
    sector: 'Waste Management',
    interest: 'Membership',
    whyJoin: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitCommunityApplication(formData);
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      title: 'Monthly Green Conclaves',
      desc: 'Exclusive access to virtual and offline panels discussing sustainability regulations, policy changes, and circular systems.',
    },
    {
      title: 'Jury & Expert Advisory',
      desc: 'Receive mentorship from green technology specialists, ESG consultants, and successful green founders.',
    },
    {
      title: 'VyapaarJagat Story Feature',
      desc: 'Get your business story drafted and published on VyapaarJagat.com, amplifying your organic search presence.',
    },
    {
      title: 'Stall & Ad Discounts',
      desc: 'Get up to 20% discount on exhibition stalls at the annual mega conclave and printed ads in the Coffee Table Book.',
    },
    {
      title: 'Investor Matchmaking',
      desc: 'Pitch opportunities to impact funds, ESG private equity firms, and corporate sustainability heads.',
    },
    {
      title: 'Peer Learning Circle',
      desc: 'Join a verified network of 500+ Indian green entrepreneurs solving circular supply chain and raw material issues.',
    },
  ];

  return (
    <div className="bg-cream-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-dark-green text-pure-white py-24 px-6 overflow-hidden text-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&w=1920&q=80&fit=crop"
            alt="People holding hands green ecosystem"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-green/90 via-dark-green to-dark-green"></div>
          <div className="absolute inset-0 heritage-ornament opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Peers Global Network
          </div>
          <h1 className="text-4xl sm:text-6xl font-playfair font-bold mb-6">
            Join India's Green Business Community
          </h1>
          <p className="text-pure-white/70 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            A collaborative network of eco-conscious founders, MSMEs, policy advocates, and ESG heads scaling sustainable business models.
          </p>
        </div>
      </section>

      {/* STORY DRIVE CAMPAIGN SPOTLIGHT */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-pure-white border border-accent-gold/30 rounded-2xl overflow-hidden shadow-xl grid lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 relative h-64 lg:h-full min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
              alt="Story Drive Concept"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-green via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-pure-white"></div>
            <div className="absolute bottom-6 left-6 text-pure-white lg:hidden">
              <span className="bg-accent-gold text-pure-white text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold rounded-sm">
                Active Campaign
              </span>
              <h3 className="font-playfair text-xl font-bold mt-2">1,000 Green Stories</h3>
            </div>
          </div>
          
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
            <span className="hidden lg:inline-block bg-accent-gold/15 text-accent-gold border border-accent-gold/30 px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest">
              National Story Drive Campaign
            </span>
            <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-dark-green leading-tight">
              Publishing 1,000 Sustainability Stories
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              In partnership with <strong>VyapaarJagat.com</strong>, we are running a national drive to document and publish the models of 1,000 green entrepreneurs. If you run a startup, community group, or MSME in the environment space, we want to write about you.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
              This digital profiling is completely <strong>FREE</strong> and provides you with a powerful third-party media asset to display to clients, bankers, and partners, while also boosting your local search ranking.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#join-form"
                className="px-6 py-3 btn-premium-primary"
              >
                Submit My Story Details
              </a>
              <a
                href="mailto:hello@greenpreneur.in?subject=Greenpreneur Story Drive Inquiry"
                className="px-6 py-3 btn-premium-secondary"
              >
                Email Secretariat
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP BENEFITS GRID */}
      <section className="py-20 bg-pure-white border-y border-light-grey">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-accent-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-3 block">
              Network Privileges
            </span>
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-dark-green">
              Membership Benefits
            </h2>
            <p className="text-xs sm:text-sm text-medium-grey mt-2 max-w-lg mx-auto font-light">
              By joining our verified directory, you gain access to targeted business opportunities and public exposure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-cream-white p-8 border border-light-grey rounded-xl shadow-sm hover:shadow-md hover:border-accent-gold transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-green/10 text-primary-green flex items-center justify-center font-bold text-sm mb-6">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h4 className="font-playfair text-lg font-bold text-dark-green mb-3">{b.title}</h4>
                <p className="text-xs sm:text-sm text-medium-grey leading-relaxed font-light">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN NOW FORM */}
      <section id="join-form" className="py-24 px-6 max-w-4xl mx-auto scroll-mt-24">
        <div className="bg-pure-white border border-light-grey rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="text-center mb-10">
            <span className="text-accent-gold font-bold uppercase tracking-[0.3em] text-[10px] block mb-2">
              Apply For Network Access
            </span>
            <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-dark-green">
              Register Your Interest
            </h3>
            <p className="text-xs text-medium-grey mt-2 font-light">
              Fill in your details below. Our community managers will review and reach out within 48 hours.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-green/10 text-primary-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-dark-green mb-2">Registration Submitted!</h4>
              <p className="text-sm text-medium-grey max-w-sm mx-auto leading-relaxed font-light">
                Thank you for applying to the Greenpreneur community. Our secretariat will verify your business profile and contact you on WhatsApp/Email.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 px-6 py-2 btn-premium-secondary"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-xs font-bold text-dark-green uppercase mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full p-3 bg-cream-white/50 border border-light-grey rounded focus:outline-none focus:ring-1 focus:ring-accent-gold text-sm"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-xs font-bold text-dark-green uppercase mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full p-3 bg-cream-white/50 border border-light-grey rounded focus:outline-none focus:ring-1 focus:ring-accent-gold text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="flex flex-col">
                  <label htmlFor="phone" className="text-xs font-bold text-dark-green uppercase mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full p-3 bg-cream-white/50 border border-light-grey rounded focus:outline-none focus:ring-1 focus:ring-accent-gold text-sm"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col">
                  <label htmlFor="city" className="text-xs font-bold text-dark-green uppercase mb-2">
                    City & State *
                  </label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Ahmedabad, Gujarat"
                    className="w-full p-3 bg-cream-white/50 border border-light-grey rounded focus:outline-none focus:ring-1 focus:ring-accent-gold text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Company */}
                <div className="flex flex-col">
                  <label htmlFor="company" className="text-xs font-bold text-dark-green uppercase mb-2">
                    Company / Organization Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. GreenTech Corp"
                    className="w-full p-3 bg-cream-white/50 border border-light-grey rounded focus:outline-none focus:ring-1 focus:ring-accent-gold text-sm"
                  />
                </div>

                {/* Sector */}
                <div className="flex flex-col">
                  <label htmlFor="sector" className="text-xs font-bold text-dark-green uppercase mb-2">
                    Sustainable Sector *
                  </label>
                  <select
                    id="sector"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full p-3 bg-cream-white/50 border border-light-grey rounded focus:outline-none focus:ring-1 focus:ring-accent-gold text-sm text-dark-text"
                  >
                    <option value="Waste Management">Waste Management / Recycling</option>
                    <option value="Renewable Energy">Renewable Energy / Solar</option>
                    <option value="Sustainable Manufacturing">Sustainable Manufacturing</option>
                    <option value="Sustainable Agriculture">Organic Farming / AgriTech</option>
                    <option value="Green Buildings">Green Building / Infrastructure</option>
                    <option value="Electric Vehicles">Electric Vehicles / EV Infrastructure</option>
                    <option value="Eco-Friendly Retail">Eco-Friendly Products / Retail</option>
                    <option value="Other">Other Sustainability Field</option>
                  </select>
                </div>
              </div>

              {/* Interest */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-dark-green uppercase mb-2">
                  What are you interested in? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { val: 'Membership', label: 'Join Community Membership' },
                    { val: 'StoryDrive', label: 'Submit Story Drive Profile' },
                    { val: 'Both', label: 'Both Membership & Story' },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`p-3 border rounded text-xs font-bold text-center cursor-pointer transition-all ${
                        formData.interest === opt.val
                          ? 'bg-primary-green text-pure-white border-primary-green shadow-sm'
                          : 'bg-cream-white/50 border-light-grey text-medium-grey hover:bg-cream-white hover:text-dark-text'
                      }`}
                    >
                      <input
                        type="radio"
                        name="interest"
                        value={opt.val}
                        checked={formData.interest === opt.val}
                        onChange={() => setFormData({ ...formData, interest: opt.val })}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Why Join */}
              <div className="flex flex-col">
                <label htmlFor="whyJoin" className="text-xs font-bold text-dark-green uppercase mb-2">
                  Briefly describe your green business or initiative *
                </label>
                <textarea
                  id="whyJoin"
                  required
                  rows={4}
                  value={formData.whyJoin}
                  onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                  placeholder="Share details about what your business does and what sustainability impact you achieve..."
                  className="w-full p-3 bg-cream-white/50 border border-light-grey rounded focus:outline-none focus:ring-1 focus:ring-accent-gold text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 btn-premium-primary flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
