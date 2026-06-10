import { useState } from 'react';
import { BookOpen, Share2, CheckCircle } from 'lucide-react';
import { submitCoffeeBookEnquiry } from '../utils/api';

export default function CoffeeTableBook() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    package: 'feature-story',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.email && formData.company) {
      setIsSubmitting(true);
      try {
        const res = await submitCoffeeBookEnquiry(formData);
        
        if (res.data && (res.data as any).totalAmount) {
          const { createPaymentOrder } = await import('../utils/api');
          const { initiateRazorpayPayment } = await import('../utils/razorpay');
          
          const orderRes = await createPaymentOrder({
            amount: (res.data as any).totalAmount,
            receipt: `coffeebook_${(res.data as any).id}`,
            notes: {
              module: 'coffee-book',
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
              amount: (res.data as any).totalAmount,
              name: formData.name,
              description: `Coffee Book: ${formData.package}`,
              prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
              },
              module: 'coffee-book',
              record_id: (res.data as any).id,
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
    }
  };

  const packages = [
    { name: 'Cover Story', price: '₹2,00,000', desc: 'Premium front cover position + 4-page spread', badge: 'SOLD OUT', badgeColor: 'bg-alert-red text-pure-white' },
    { name: 'Back Cover', price: '₹50,000', desc: 'High-visibility rear exterior placement', badge: '1 Slot Only', badgeColor: 'bg-warning-amber text-pure-white' },
    { name: 'Inside Front/Back Cover', price: '₹40,000', desc: 'First or last interior page placement', badge: '1 Slot Only', badgeColor: 'bg-warning-amber text-pure-white' },
    { name: 'Full-Page Advertisement', price: '₹20,000', desc: 'Curated design service included', badge: 'Limited', badgeColor: 'bg-warning-amber text-pure-white' },
    { name: 'Inside Feature Story', price: '₹15,000', desc: '2-page pictorial business narrative', badge: 'Open', badgeColor: 'bg-primary-green text-pure-white' },
    { name: 'Green Editorial Spread', price: '₹10,000', desc: 'Sector-specific expert feature', badge: 'Limited', badgeColor: 'bg-warning-amber text-pure-white' },
    { name: 'Inside Feature (Members)', price: '₹5,000', desc: 'Exclusively for MEIF Community Members', badge: 'Members Only', badgeColor: 'bg-primary-green text-pure-white' },
    { name: 'Extra Print Copies', price: '₹300 /copy', desc: 'Reserve additional hardbound copies', badge: 'Open', badgeColor: 'bg-primary-green text-pure-white' },
  ];

  return (
    <div className="font-inter text-dark-text bg-pure-white min-h-screen">
      {/* Header */}
      <header className="relative bg-cream-white py-20 px-6 overflow-hidden border-b border-light-grey">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 z-10">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-dark-green text-pure-white text-xs font-bold uppercase tracking-widest rounded-full">
                <span className="w-2 h-2 bg-accent-gold rounded-full animate-pulse"></span>
                Premium Publication 2026
              </span>
              <span className="text-[10px] font-bold text-primary-green uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent-gold rounded-full"></span>
                Viksit Bharat @2047
              </span>
            </div>

            <h2 className="font-playfair text-5xl lg:text-7xl text-dark-green leading-[1.1] mb-6">
              Top 50 <br />
              Sustainable <span className="italic text-accent-gold">Leaders</span>
            </h2>

            <p className="text-lg text-dark-green/70 font-playfair leading-relaxed mb-10 max-w-xl italic">
              "A curated anthology of visionaries redefining India's green economy. A legacy print edition for those who lead by example."
            </p>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="border-l-2 border-accent-gold pl-6">
                <span className="block text-3xl font-playfair text-dark-green font-bold">5,000+</span>
                <span className="text-xs text-medium-grey font-bold uppercase tracking-widest">
                  Print Copies
                </span>
              </div>
              <div className="border-l-2 border-accent-gold pl-6">
                <span className="block text-3xl font-playfair text-dark-green font-bold">5,00,000+</span>
                <span className="text-xs text-medium-grey font-bold uppercase tracking-widest">
                  Digital Reach
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#apply"
                className="px-8 py-4 btn-premium-primary"
              >
                Reserve Your Slot
              </a>
              <a
                href="#packages"
                className="px-8 py-4 btn-premium-secondary"
              >
                View Packages
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 relative h-[450px] flex items-center justify-center">
            <div className="absolute inset-0 bg-primary-green/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 p-4 bg-pure-white shadow-2xl rounded-sm border-[12px] border-pure-white transform rotate-2 hover:rotate-0 transition-all duration-500 max-w-[320px]">
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80"
                alt="Coffee Table Book Mockup"
                className="w-full h-auto"
              />
              <div className="absolute top-0 right-0 bg-accent-gold text-pure-white px-5 py-1.5 transform translate-x-1/2 -translate-y-1/2 shadow-lg text-xs font-serif italic">
                Collector's Edition
              </div>
            </div>

            {/* Status updates tag */}
            <div className="absolute bottom-6 left-6 z-20 bg-pure-white p-5 rounded-2xl shadow-xl max-w-[180px] border border-light-grey">
              <p className="text-[9px] uppercase tracking-widest font-bold mb-1 text-accent-gold">
                Cover Story
              </p>
              <span className="inline-block bg-alert-red text-pure-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Sold Out
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Founder Quote */}
      <section className="py-16 px-6 bg-pure-white relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-0.5 bg-accent-gold/30 mx-auto mb-10"></div>
          <h3 className="font-playfair text-2xl sm:text-3xl text-dark-green italic leading-normal mb-8 px-4 font-light">
            "Nomination is FREE. Always. This is our way of celebrating the green entrepreneur. This book is the permanent record of that celebration."
          </h3>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden mb-3 border-2 border-accent-gold shadow-md">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Dr. Pravin Parmar"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-bold text-dark-green text-sm">Dr. Pravin Parmar</p>
            <p className="text-[10px] uppercase tracking-widest text-accent-gold font-bold">
              Founder, MEIF
            </p>
          </div>
        </div>
      </section>

      {/* Value Details */}
      <section className="py-20 px-6 bg-cream-white border-y border-light-grey">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 bg-pure-white rounded-3xl border border-light-grey shadow-sm">
                <BookOpen className="w-10 h-10 text-primary-green mb-6" />
                <h4 className="font-playfair text-xl text-dark-green mb-2">Premium Print</h4>
                <p className="text-xs text-medium-grey leading-relaxed font-light">
                  High-GSM textured papers, luxury hardbound gold embossing cover designed for library and lobby archives.
                </p>
              </div>
              <div className="p-8 bg-dark-green text-pure-white rounded-3xl sm:mt-8 shadow-md">
                <Share2 className="w-10 h-10 text-accent-gold mb-6" />
                <h4 className="font-playfair text-xl mb-2 text-accent-gold">5,00,000+ Reach</h4>
                <p className="text-xs text-pure-white/70 leading-relaxed font-light">
                  Massive digital distributions to central and state nodal ministries, corporate ESG teams, and directories.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-accent-gold font-bold tracking-[0.3em] text-[10px] uppercase block">
                Distribution & Reach
              </span>
              <h3 className="font-playfair text-3xl sm:text-4xl text-dark-green font-bold">
                Capturing the Green Legacy
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                The Greenpreneur 2026 Coffee Table Book is a premium publication launched at our main awards gala. It stands as a permanent record of sustainable innovations and is distributed directly to decision-makers in the sustainability ecosystem.
              </p>
              <ul className="space-y-4 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                  <span>Distributed to all 500+ conclave delegates</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                  <span>Showcased across Peers Global Business Platforms</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                  <span>Included pictorial lifetime listing in Vyapaar Jagat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Pricing Table */}
      <section id="packages" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary-green font-bold uppercase tracking-widest text-[10px] block">
              Feature Packages
            </span>
            <h3 className="font-playfair text-3xl font-bold text-dark-green mt-2">
              Book Inclusion & Pricing
            </h3>
            <p className="text-xs text-medium-grey mt-2">
              No GST is applicable on these contributions since payments support Section 8 NGO projects.
            </p>
          </div>

          <div className="bg-pure-white rounded-3xl border border-light-grey overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-dark-green text-pure-white text-xs uppercase tracking-widest">
                    <th className="py-5 px-6">Feature Slot</th>
                    <th className="py-5 px-6">Investment</th>
                    <th className="py-5 px-6 text-right">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-grey text-xs">
                  {packages.map((pkg, i) => (
                    <tr key={i} className="hover:bg-cream-white/50 transition-colors">
                      <td className="py-6 px-6">
                        <div className="font-bold text-sm text-dark-green">{pkg.name}</div>
                        <div className="text-[10px] text-medium-grey mt-0.5">{pkg.desc}</div>
                      </td>
                      <td className="py-6 px-6 font-bold text-primary-green text-sm">
                        {pkg.price}
                      </td>
                      <td className="py-6 px-6 text-right">
                        <span className={`px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${pkg.badgeColor}`}>
                          {pkg.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Application and Payment section */}
      <section id="apply" className="py-20 px-6 bg-dark-green text-pure-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div className="bg-pure-white/5 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-pure-white/10 shadow-xl">
              <h3 className="font-playfair text-2xl font-bold mb-1">Apply for Feature</h3>
              <p className="text-xs text-pure-white/60 mb-8">
                Submit details below. Our editorial board will contact you to request photos and draft copy.
              </p>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-green/20 text-accent-gold rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-1 text-pure-white">Application Recorded</h4>
                  <p className="text-xs text-pure-white/70 px-4 leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your request to feature <strong>{formData.company}</strong> has been sent to our editorial desk. We will reach out on WhatsApp/Email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-wider text-accent-gold block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-black/35 border border-pure-white/20 rounded-lg text-xs outline-none focus:border-accent-gold text-pure-white"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-wider text-accent-gold block mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-black/35 border border-pure-white/20 rounded-lg text-xs outline-none focus:border-accent-gold text-pure-white"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-accent-gold block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-black/35 border border-pure-white/20 rounded-lg text-xs outline-none focus:border-accent-gold text-pure-white"
                      placeholder="hello@greenpreneur.in"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-accent-gold block mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-black/35 border border-pure-white/20 rounded-lg text-xs outline-none focus:border-accent-gold text-pure-white"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-accent-gold block mb-1">
                      Inclusion Package Selection
                    </label>
                    <select
                      value={formData.package}
                      onChange={(e) => setFormData((p) => ({ ...p, package: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-black/35 border border-pure-white/20 rounded-lg text-xs outline-none focus:border-accent-gold text-pure-white"
                    >
                      <option value="back-cover">Back Cover (₹50,000)</option>
                      <option value="inside-cover">Inside Front/Back Cover (₹40,000)</option>
                      <option value="full-page">Full-Page Advertisement (₹20,000)</option>
                      <option value="feature-story">Inside Feature Story (₹15,000)</option>
                      <option value="editorial">Green Editorial Spread (₹10,000)</option>
                      <option value="member-feature">Inside Feature - Members (₹5,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-accent-gold block mb-1">
                      Brief Message (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-black/35 border border-pure-white/20 rounded-lg text-xs outline-none focus:border-accent-gold text-pure-white resize-none"
                      placeholder="Any specific requests or category mentions..."
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 btn-premium-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Feature Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Payment Details */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <h3 className="font-playfair text-3xl font-bold mb-4">Payment & Confirmation</h3>
                <p className="text-xs text-pure-white/70 leading-relaxed font-light">
                  Your payments go directly to support MEIF's green training and entrepreneurship drives. UPI or bank transfer options are open below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-pure-white/5 border border-pure-white/10 rounded-2xl p-6 flex items-center gap-6">
                  <div className="w-16 h-12 bg-pure-white rounded-lg flex items-center justify-center p-2 text-dark-green font-bold font-serif">
                    UPI
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-accent-gold block mb-0.5">
                      UPI Address
                    </span>
                    <span className="font-mono text-sm block">eazypay.0000054327@icici</span>
                  </div>
                </div>

                <div className="bg-pure-white/5 border border-pure-white/10 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-bold text-accent-gold uppercase tracking-wider border-b border-pure-white/10 pb-2">
                    Bank Transfer Details
                  </h4>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-mono">
                    <span className="text-pure-white/40">Account Name:</span>
                    <span>1 Million Entrepreneurs Intl Forum</span>
                    <span className="text-pure-white/40">Bank:</span>
                    <span>ICICI Bank</span>
                    <span className="text-pure-white/40">Account No:</span>
                    <span>471401000076</span>
                    <span className="text-pure-white/40">IFSC Code:</span>
                    <span>ICIC0004714</span>
                    <span className="text-pure-white/40">Branch:</span>
                    <span>AEC Cross Road, Ahmedabad</span>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-[10px] text-pure-white/60 italic">
                    You will be redirected to the secure Razorpay checkout after clicking "Submit Feature Request".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
