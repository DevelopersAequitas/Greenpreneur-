import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { submitCommunityApplication, createPaymentOrder } from '../utils/api';

export default function Community() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    company: '',
    sector: 'Waste Management',
    whyJoin: '',
  });
  const [website, setWebsite] = useState('');
  const [promoterImage, setPromoterImage] = useState<File | null>(null);
  const [organizationLogo, setOrganizationLogo] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit.');
        e.target.value = ''; // Reset input
        setter(null);
      } else {
        setter(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('city', formData.city);
      data.append('company', formData.company);
      data.append('website', website);
      data.append('sector', formData.sector);
      data.append('whyJoin', formData.whyJoin);
      if (promoterImage) {
        data.append('promoterImage', promoterImage);
      }
      if (organizationLogo) {
        data.append('organizationLogo', organizationLogo);
      }

      const res = await submitCommunityApplication(data);

      if (res.success && res.data && res.data.amount) {
        const { initiateRazorpayPayment } = await import('../utils/razorpay');
        const orderRes = await createPaymentOrder({
          amount: res.data.amount,
          receipt: `community_${res.data.id}`,
          notes: {
            module: 'community',
            record_id: String(res.data.id),
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
            amount: res.data.amount,
            name: formData.name,
            description: 'Lifetime Community Membership',
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
            module: 'community',
            record_id: res.data.id,
          },
          () => setSubmitted(true),
          (err) => alert(err.message || 'Payment failed or cancelled.')
        );
      } else {
        setSubmitted(true);
      }
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
          <p className="text-pure-white/70 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
            A collaborative network of eco-conscious founders, MSMEs, policy advocates, and ESG heads scaling sustainable business models.
          </p>
          <a
            href="#join-form"
            className="inline-flex items-center gap-2 bg-accent-gold text-dark-green font-bold px-8 py-4 rounded-lg text-sm uppercase tracking-wider hover:bg-accent-gold/90 transition-all duration-200 shadow-lg hover:shadow-accent-gold/30 hover:scale-105"
          >
            Join Our Community
          </a>
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
              Join the Community
            </h3>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-green/10 text-primary-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-dark-green mb-2">Welcome to the Community!</h4>
              <p className="text-sm text-medium-grey max-w-sm mx-auto leading-relaxed font-light">
                Thank you for joining the Greenpreneur community. Our team will contact you on WhatsApp/Email shortly.
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
                    Business / Organization Name *
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

                {/* Website */}
                <div className="flex flex-col">
                  <label htmlFor="website" className="text-xs font-bold text-dark-green uppercase mb-2">
                    Website Link
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://greentech.com"
                    className="w-full p-3 bg-cream-white/50 border border-light-grey rounded focus:outline-none focus:ring-1 focus:ring-accent-gold text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Promoter Image */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-dark-green uppercase mb-2">
                    Upload Promoter Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setPromoterImage)}
                    className="w-full text-xs text-medium-grey file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-green/10 file:text-primary-green hover:file:bg-primary-green/20"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Max file size: 5 MB</p>
                </div>

                {/* Organization Logo */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-dark-green uppercase mb-2">
                    Upload Organization Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setOrganizationLogo)}
                    className="w-full text-xs text-medium-grey file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-green/10 file:text-primary-green hover:file:bg-primary-green/20"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Max file size: 5 MB</p>
                </div>
              </div>

              {/* Sector */}
              <div className="flex flex-col">
                <label htmlFor="sector" className="text-xs font-bold text-dark-green uppercase mb-2">
                  Sustainable Sector / Industry Category *
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

              {/* Why Join */}
              <div className="flex flex-col">
                <label htmlFor="whyJoin" className="text-xs font-bold text-dark-green uppercase mb-2">
                  Give brief introduction / Green Initiative *
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

              {/* Payment Summary Box */}
              <div className="bg-cream-white/60 border border-[#B38728]/30 rounded-xl p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-light-grey">
                  <div>
                    <h4 className="text-sm font-bold text-dark-green uppercase">Lifetime Membership</h4>
                    <p className="text-xs text-medium-grey mt-0.5">One-time payment for full platform benefits</p>
                  </div>
                  <span className="text-base font-bold text-dark-green">₹ 2,500</span>
                </div>
                <div className="flex justify-between items-center text-dark-green font-black">
                  <span>Total Amount</span>
                  <span className="text-lg">₹ 2,500</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 btn-premium-primary flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Pay & Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
