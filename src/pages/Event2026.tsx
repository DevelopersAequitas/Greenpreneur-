import { useState } from 'react';
import { Calendar, MapPin, Clock, Shield, Award, Coffee, ChevronRight, CheckCircle } from 'lucide-react';
import { registerForEvent } from '../utils/api';

export default function Event2026() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    segment: 'Green Entrepreneur',
  });
  const [passOption, setPassOption] = useState<'no_dinner' | 'with_dinner'>('no_dinner');
  const [registered, setRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone) {
      setIsSubmitting(true);
      try {
        const passAmount = passOption === 'with_dinner' ? 1500 : 750;
        const passTypeName = passOption === 'with_dinner' ? 'Delegate (With Dinner)' : 'Delegate (Without Dinner)';

        const res = await registerForEvent({
          ...formData,
          pass_type: passTypeName,
          pass_amount: passAmount,
        }) as any;

        if (res.success) {
          if (res.requiresPayment && res.order) {
            const { initiateRazorpayPayment } = await import('../utils/razorpay');
            initiateRazorpayPayment(
              {
                key_id: res.key_id,
                order_id: res.order.id,
                amount: passAmount,
                name: formData.name,
                description: `Greenpreneur 2026 - ${passTypeName}`,
                prefill: {
                  name: formData.name,
                  email: formData.email,
                  contact: formData.phone,
                },
                module: 'events',
                record_id: res.registrationId,
              },
              () => {
                setRegistered(true);
              },
              (err) => {
                alert(err.message || 'Payment failed or cancelled.');
              }
            );
          } else {
            setRegistered(true);
          }
        }
      } catch (err: any) {
        alert(err.message || 'Registration failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const agenda = [
    { time: '02:00 PM', title: 'Arrival & Greenpreneur Celebration', desc: 'Warm welcome, badge distribution, and green networking reception.' },
    { time: '03:15 PM', title: 'Panel Discussion: Sustainability in Viksit Bharat', desc: 'Dialogues on aligning environmental governance and business ethics with national 2047 goals.' },
    { time: '04:15 PM', title: 'Coffee Table Book Launch', desc: 'Exclusive unveiling of the premium hardcover book "Top 50 Sustainable Leaders".' },
    { time: '04:30 PM', title: 'Greenpreneur Awards Ceremony', desc: 'Presentation of 35+ prestigious awards honoring eco-industry leaders.' },
    { time: '05:15 PM', title: 'Peers Global Roundtable Conclave', desc: 'Curated corporate business match-makings and strategy networking for scaling.' },
    { time: '06:45 PM', title: 'Leadership Ceremony & New Member Welcome', desc: 'Welcoming new Peers Global platform members and setting the 2026 roadmap.' },
    { time: '07:35 PM', title: 'Peers Global Awards', desc: 'Celebrating cross-sector international business partnerships and excellence.' },
    { time: '08:45 PM', title: 'Gala Dinner & Live Music', desc: 'Grand eco-friendly dining experience accompanied by live traditional music performances.' },
  ];

  const audienceTypes = [
    { title: 'Green Entrepreneurs', icon: SproutIcon },
    { title: 'MSME Owners', icon: BuildingIcon },
    { title: 'Sustainable Startups', icon: RocketIcon },
    { title: 'CXOs & Executives', icon: AwardIcon },
    { title: 'NGO Leaders', icon: HeartIcon },
    { title: 'Government Officials', icon: GovIcon },
    { title: 'Corporate Sponsors', icon: HandshakeIcon },
    { title: 'Green Architects', icon: HomeIcon },
  ];

  return (
    <div className="font-inter text-dark-text bg-cream-white min-h-screen">
      {/* Header Banner */}
      <header className="relative bg-dark-green pt-20 pb-32 px-6 overflow-hidden text-pure-white">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"
            alt="Event Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-green via-dark-green/90 to-dark-green"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 border border-accent-gold/30 rounded-full mb-8 bg-dark-green/50 backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-gold animate-pulse"></span>
            <span className="text-accent-gold font-bold text-[10px] uppercase tracking-[0.3em]">
              5th Year Anniversary Celebration
            </span>
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl text-pure-white mb-6 leading-tight tracking-tight">
            Greenpreneur <span className="text-accent-gold">2026</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-pure-white/70 max-w-2xl mx-auto mb-16 font-light leading-relaxed italic">
            India's most comprehensive gathering of green entrepreneurs, investors, and climate pioneers.
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-pure-white/10 pt-16">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-pure-white/20 flex items-center justify-center mb-4 text-accent-gold">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-[9px] text-pure-white/40 uppercase tracking-widest mb-1 font-bold">Date</p>
              <p className="font-playfair text-xl">25 June 2026</p>
              <p className="text-pure-white/50 text-xs mt-0.5">Thursday (2:00 – 9:30 PM)</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-pure-white/20 flex items-center justify-center mb-4 text-accent-gold">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-[9px] text-pure-white/40 uppercase tracking-widest mb-1 font-bold">Venue</p>
              <p className="font-playfair text-xl">Renaissance by Marriott</p>
              <p className="text-pure-white/50 text-xs mt-0.5">S.G. Highway, Ahmedabad</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-pure-white/20 flex items-center justify-center mb-4 text-accent-gold">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-[9px] text-pure-white/40 uppercase tracking-widest mb-1 font-bold">Attendance</p>
              <p className="font-playfair text-xl">150–500 Leaders</p>
              <p className="text-pure-white/50 text-xs mt-0.5">Exclusive Networking Gala</p>
            </div>
          </div>
        </div>
      </header>

      {/* Agenda timeline */}
      <section id="agenda" className="py-20 px-6 bg-pure-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full opacity-5 pointer-events-none heritage-ornament"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-accent-gold font-bold uppercase tracking-[0.4em] text-[10px] block mb-2">
              Event Schedule
            </span>
            <h2 className="font-playfair text-4xl sm:text-5xl text-dark-green tracking-tight font-bold">
              The Agenda
            </h2>
            <div className="w-20 h-0.5 bg-accent-gold mx-auto mt-4"></div>
          </div>

          <div className="relative border-l border-accent-gold/30 ml-4 md:ml-40 pl-8 space-y-12">
            {agenda.map((item, idx) => (
              <div key={idx} className="relative agenda-item group">
                {/* Dot */}
                <div className="absolute -left-[38px] top-1 w-4 h-4 bg-accent-gold rounded-full border-2 border-pure-white shadow-md group-hover:scale-125 transition-transform" />

                {/* Mobile time display */}
                <span className="text-accent-gold font-bold text-xs uppercase tracking-widest block mb-1 md:absolute md:-left-40 md:w-28 md:text-right md:top-1 font-mono">
                  {item.time}
                </span>

                <h3 className="font-playfair text-xl font-bold text-dark-green mb-2 group-hover:text-primary-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-medium-grey leading-relaxed max-w-xl font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="py-20 px-6 bg-cream-white border-y border-light-grey">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-accent-gold font-bold uppercase tracking-widest text-[10px] block mb-2">
                Five-Star Venue
              </span>
              <h2 className="font-playfair text-4xl font-bold text-dark-green mb-6">
                Renaissance by Marriott
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8 font-light">
                Renaissance by Marriott Ahmedabad Hotel is situated in the business heart of Gujarat on the S.G. Highway, offering sophisticated halls, modern audio-visual infrastructure, and a green catering menu tailored specifically for eco-industry networking.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Premium Facilities', desc: 'Advanced seating formats, premium backdrops, and parking logic for 500+ attendees.', icon: Shield },
                  { title: 'Culinary Masterpieces', desc: 'Catered menu curated by our partner association CEED, utilizing fresh organic produce.', icon: Coffee },
                  { title: 'Strategic Location', desc: 'Situated right on the main S.G. Highway, just 30 mins from Ahmedabad Airport.', icon: MapPin },
                ].map((facility, i) => {
                  const Icon = facility.icon;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 bg-pure-white rounded-full border border-light-grey flex items-center justify-center shrink-0 shadow-sm text-primary-green">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-dark-green">{facility.title}</h4>
                        <p className="text-xs text-medium-grey font-light mt-0.5">{facility.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map image block */}
            <div className="relative group">
              <div className="absolute -inset-4 border-2 border-accent-gold/20 rounded-2xl pointer-events-none"></div>
              <img
                src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                alt="Marriott Ahmedabad Lobby/Facade"
                className="w-full h-[380px] object-cover rounded-xl shadow-lg border border-light-grey"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-pure-white/95 backdrop-blur-md p-6 rounded-lg shadow-xl border border-light-grey">
                <span className="text-[9px] text-accent-gold font-bold uppercase tracking-widest mb-1 block">
                  Secretariat Address
                </span>
                <p className="text-dark-green font-bold text-xs leading-normal">
                  Behind Ganesh Meridian, S.G. Highway, Sola, Ahmedabad, Gujarat 380060
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-primary-green font-bold text-[10px] uppercase tracking-wider hover:underline"
                >
                  Locate on Google Maps <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Attend */}
      <section id="attendees" className="py-20 px-6 bg-dark-green text-pure-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-3">Who Should Attend</h2>
            <p className="text-accent-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
              Building a permanent green economy across 150+ sectors
            </p>
            <p className="text-pure-white/60 text-xs max-w-xl mx-auto font-light leading-relaxed">
              Uniting key ecosystem stakeholders to forge partnerships and drive ESG value.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {audienceTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <div
                  key={idx}
                  className="border border-pure-white/10 p-6 rounded-xl text-center bg-pure-white/5 hover:bg-pure-white/10 transition-colors"
                >
                  <Icon className="w-8 h-8 text-accent-gold mx-auto mb-4" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">{type.title}</h4>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Delegate pass registration form */}
      <section id="register" className="py-20 px-6 bg-pure-white">
        <div className="max-w-xl mx-auto">
          <div className="bg-cream-white p-8 sm:p-12 rounded-3xl border border-light-grey shadow-lg">
            <div className="text-center mb-8">
              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-dark-green mb-2">
                Register as Delegate
              </h3>
              <p className="text-xs text-medium-grey">
                Secure your delegate pass. Our team will verify credentials and text you entry codes.
              </p>
            </div>

            {registered ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-primary-green/10 text-primary-green rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-dark-green text-lg mb-1">Pass Secured Successfully!</h4>
                <p className="text-xs text-medium-grey px-4 leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your delegate pass for <strong>{passOption === 'with_dinner' ? 'Delegate (With Dinner)' : 'Delegate (Without Dinner)'}</strong> has been successfully booked and paid. A confirmation email and ticket details will be sent to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-medium-grey block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-pure-white border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/10"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-medium-grey block mb-1.5">
                    Mobile Number (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-pure-white border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/10"
                    placeholder="e.g. +91 70411 51714"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-medium-grey block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-pure-white border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/10"
                    placeholder="hello@greenpreneur.in"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-medium-grey block mb-1.5">
                    City & State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-pure-white border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/10"
                    placeholder="Ahmedabad, Gujarat"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-medium-grey block mb-1.5">
                    Attendee Profile Segment
                  </label>
                  <select
                    value={formData.segment}
                    onChange={(e) => setFormData((p) => ({ ...p, segment: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-pure-white border border-light-grey rounded-lg text-xs outline-none focus:border-primary-green"
                  >
                    <option>Green Entrepreneur</option>
                    <option>MSME Owner</option>
                    <option>Startup Founder</option>
                    <option>Corporate ESG Executive</option>
                    <option>NGO / Social Enterprise</option>
                    <option>Student / Academic</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-medium-grey block mb-2">
                    Select Pass Option
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${passOption === 'no_dinner' ? 'border-primary-green bg-primary-green/5 shadow-sm' : 'border-light-grey bg-pure-white hover:border-medium-grey'}`}>
                      <input
                        type="radio"
                        name="passOption"
                        value="no_dinner"
                        checked={passOption === 'no_dinner'}
                        onChange={() => setPassOption('no_dinner')}
                        className="sr-only"
                      />
                      <span className="font-bold text-xs text-dark-green mb-1">Without Dinner</span>
                      <span className="text-[10px] text-medium-grey mb-3">General access to event sessions & awards.</span>
                      <span className="text-sm font-bold text-primary-green mt-auto">₹750</span>
                    </label>

                    <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${passOption === 'with_dinner' ? 'border-primary-green bg-primary-green/5 shadow-sm' : 'border-light-grey bg-pure-white hover:border-medium-grey'}`}>
                      <input
                        type="radio"
                        name="passOption"
                        value="with_dinner"
                        checked={passOption === 'with_dinner'}
                        onChange={() => setPassOption('with_dinner')}
                        className="sr-only"
                      />
                      <span className="font-bold text-xs text-dark-green mb-1 flex items-center justify-between">
                        With Dinner <span className="bg-accent-gold/25 text-[#A07020] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Popular</span>
                      </span>
                      <span className="text-[10px] text-medium-grey mb-3">Access to event sessions & Gala Networking Dinner.</span>
                      <span className="text-sm font-bold text-primary-green mt-auto">₹1,500</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 btn-premium-primary text-sm flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'PROCESSING...' : `PAY & REGISTER (₹${passOption === 'with_dinner' ? '1,500' : '750'})`} 
                    <ChevronRight className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>

                <div className="text-[10px] text-center text-medium-grey font-light">
                  Passes are first-come first-served. Registration includes GST and gateway charges.
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// Stub Icons to keep layout self-contained
function SproutIcon(props: any) {
  return <Award className={props.className} />;
}
function BuildingIcon(props: any) {
  return <Award className={props.className} />;
}
function RocketIcon(props: any) {
  return <Award className={props.className} />;
}
function AwardIcon(props: any) {
  return <Award className={props.className} />;
}
function HeartIcon(props: any) {
  return <Award className={props.className} />;
}
function GovIcon(props: any) {
  return <Award className={props.className} />;
}
function HandshakeIcon(props: any) {
  return <Award className={props.className} />;
}
function HomeIcon(props: any) {
  return <Award className={props.className} />;
}
