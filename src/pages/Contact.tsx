import { useState } from 'react';
import { Phone, MessageCircle, MapPin, Calendar, Award, CheckCircle } from 'lucide-react';
import { submitContactEnquiry } from '../utils/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'Awards',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.email) {
      setIsSubmitting(true);
      try {
        await submitContactEnquiry(formData);
        setSubmitted(true);
      } catch (err: any) {
        alert(err.message || 'Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="font-inter text-dark-text bg-pure-white min-h-screen">
      {/* Banner */}
      <section className="relative bg-dark-green py-20 px-6 text-center text-pure-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80"
            alt="Nature Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-green via-dark-green/90 to-dark-green"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-accent-gold font-bold tracking-widest uppercase text-xs mb-4 block">
            Connect with our leadership
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-pure-white font-bold mb-6">
            Let's Build a Greener <br /> Future Together
          </h1>
          <p className="text-pure-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have a question about nominations, sponsorship tiers, or stall bookings? Our coordinators are here to guide you.
          </p>
        </div>
      </section>

      {/* Leadership Profile Cards */}
      <section className="relative z-20 -mt-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dr. Pravin Parmar */}
            <div className="bg-pure-white rounded-3xl p-8 shadow-xl border border-light-grey flex flex-col items-center text-center hover:translate-y-[-4px] transition-all duration-300 group">
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-cream-white shadow-md bg-white">
                  <img
                    src="/pravin.png"
                    alt="Dr. Pravin Parmar"
                    className="w-full h-full object-cover scale-[1.7] origin-[50%_40%]"
                  />
                </div>
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-primary-green rounded-full flex items-center justify-center border-2 border-pure-white text-pure-white">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-dark-green mb-1">
                Dr. Pravin Parmar
              </h3>
              <p className="text-accent-gold font-semibold uppercase tracking-wider text-[10px] mb-4">
                Founder — MEIF NGO
              </p>
              <p className="text-gray-500 mb-8 max-w-xs text-xs leading-relaxed font-light">
                "Greenpreneur is more than an event; it's a commitment to India's sustainable growth. Join our national mission."
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <a
                  href="tel:+917041151714"
                  className="py-3 btn-premium-primary"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href="https://wa.me/917041151714"
                  className="py-3 bg-[#25D366] text-pure-white text-center rounded-xl font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Vishal Parmar */}
            <div className="bg-pure-white rounded-3xl p-8 shadow-xl border border-light-grey flex flex-col items-center text-center hover:translate-y-[-4px] transition-all duration-300 group">
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-cream-white shadow-md">
                  <img
                    src="/vishal.jpeg"
                    alt="Vishal Parmar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-[#25D366] rounded-full flex items-center justify-center border-2 border-pure-white text-pure-white">
                  <MessageCircle className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-dark-green mb-1">
                Vishal Parmar
              </h3>
              <p className="text-accent-gold font-semibold uppercase tracking-wider text-[10px] mb-4">
                Director — Peers Global
              </p>
              <p className="text-gray-500 mb-8 max-w-xs text-xs leading-relaxed font-light">
                Contact directly for corporate sponsorships, exhibition stall bookings, and leadership event registrations.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <a
                  href="tel:+917041151714"
                  className="py-3 btn-premium-primary"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href="https://wa.me/917041151714"
                  className="py-3 bg-[#25D366] text-pure-white text-center rounded-xl font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form & Contact details */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Form */}
            <div className="lg:col-span-7 bg-pure-white rounded-3xl p-8 md:p-12 border border-light-grey shadow-xl">
              <h2 className="font-playfair text-3xl font-bold text-dark-green mb-2">Send a Message</h2>
              <p className="text-xs text-medium-grey mb-8">
                Drop your query here. We usually respond within 24 hours.
              </p>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-green/10 text-primary-green rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-dark-green text-lg mb-1">Message Sent!</h4>
                  <p className="text-xs text-medium-grey px-4 leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your message has been sent to our secretariat desk. We will reach out on WhatsApp/Email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        className="w-full bg-cream-white border border-light-grey rounded-lg px-4 py-3 text-xs outline-none focus:border-primary-green focus:bg-pure-white"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-cream-white border border-light-grey rounded-lg px-4 py-3 text-xs outline-none focus:border-primary-green focus:bg-pure-white"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className="w-full bg-cream-white border border-light-grey rounded-lg px-4 py-3 text-xs outline-none focus:border-primary-green focus:bg-pure-white"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                      I'm Interested In
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData((p) => ({ ...p, interest: e.target.value }))}
                      className="w-full bg-cream-white border border-light-grey rounded-lg px-4 py-3 text-xs outline-none focus:border-primary-green"
                    >
                      <option value="Awards">Award Nomination</option>
                      <option value="Sponsorship">Sponsorship Opportunities</option>
                      <option value="Book">Coffee Table Book Feature</option>
                      <option value="Exhibition">Exhibition Stall space</option>
                      <option value="Speaking">Speaking / Masterclass proposal</option>
                      <option value="General">General Inquiries</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                      Your Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      className="w-full bg-cream-white border border-light-grey rounded-lg px-4 py-3 text-xs outline-none focus:border-primary-green focus:bg-pure-white resize-none"
                      placeholder="Describe your query or sustainable operations..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 btn-premium-primary font-black uppercase tracking-[0.2em] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}
            </div>

            {/* Info and credentials panel */}
            <div className="lg:col-span-5 space-y-8">
              {/* Card 1 */}
              <div className="bg-cream-white rounded-3xl p-8 border border-light-grey">
                <h4 className="font-playfair text-xl font-bold text-dark-green mb-6">
                  Contact Information
                </h4>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pure-white flex items-center justify-center shrink-0 shadow-sm text-primary-green">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-gray-900">Registered Secretariat</h5>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Shapath 1, 805, Sarkhej - Gandhinagar Hwy, Highway Park Society, Bodakdev, Ahmedabad, Gujarat 380015.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pure-white flex items-center justify-center shrink-0 shadow-sm text-primary-green">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-gray-900">Greenpreneur 2026 Venue</h5>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Renaissance by Marriott Hotel, S.G. Highway, Sola, Ahmedabad, Gujarat.<br />
                        Date: Thursday, 25th June 2026.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
