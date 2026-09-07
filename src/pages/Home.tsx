import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GoogleReviews from '../components/GoogleReviews';
import HallOfGreen from '../components/HallOfGreen';
import { submitContactEnquiry } from '../utils/api';
import { 
  Award, Users, Megaphone, BookOpen, Share2, ArrowRight, MapPin, Clock,
  Heart, Droplets, Zap, TrendingUp, Cpu, Scale, Home as HomeIcon, RefreshCw, 
  Globe, Fish, Trees, ShieldCheck, Handshake, Download, ChevronRight,
  Info, Leaf, Check, X, FileText
} from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// 17 UN Sustainable Development Goals Data
const sdgData = [
  { id: 1, name: 'No Poverty', color: '#E5243B', icon: Users, desc: 'End poverty in all its forms everywhere.', target: 'Support rural green livelihoods and micro-entrepreneurship.' },
  { id: 2, name: 'Zero Hunger', color: '#DDA63A', icon: Leaf, desc: 'End hunger, achieve food security and improved nutrition.', target: 'Promote organic farming, precision agriculture, and zero waste.' },
  { id: 3, name: 'Good Health & Well-being', color: '#4C9F38', icon: Heart, desc: 'Ensure healthy lives and promote well-being for all.', target: 'Eliminate toxic waste, promote clean air and organic products.' },
  { id: 4, name: 'Quality Education', color: '#C5192D', icon: BookOpen, desc: 'Ensure inclusive and equitable quality education.', target: 'Support sustainability literacy and green skills training.' },
  { id: 5, name: 'Gender Equality', color: '#EF402C', icon: Users, desc: 'Achieve gender equality and empower all women and girls.', target: 'Fund women-led green startups and clean energy access.' },
  { id: 6, name: 'Clean Water & Sanitation', color: '#26BDE2', icon: Droplets, desc: 'Ensure availability and sustainable management of water.', target: 'Innovative waste water recycling and river restoration tech.' },
  { id: 7, name: 'Affordable & Clean Energy', color: '#FCC30B', icon: Zap, desc: 'Ensure access to affordable, reliable, sustainable energy.', target: 'Accelerate solar, wind, and biogas adoption across MSMEs.' },
  { id: 8, name: 'Decent Work & Economic Growth', color: '#A21942', icon: TrendingUp, desc: 'Promote sustained, inclusive sustainable economic growth.', target: 'Create green jobs in recycling, clean tech, and eco-tourism.' },
  { id: 9, name: 'Industry, Innovation & Infra', color: '#FD6925', icon: Cpu, desc: 'Build resilient infrastructure, promote inclusive industrialization.', target: 'Retrofit industrial zones for carbon efficiency and smart energy.' },
  { id: 10, name: 'Reduced Inequalities', color: '#DD1367', icon: Scale, desc: 'Reduce inequality within and among countries.', target: 'Bridging urban-rural economic divides through green micro-grids.' },
  { id: 11, name: 'Sustainable Cities & Communities', color: '#FD9D24', icon: HomeIcon, desc: 'Make cities safe, resilient and sustainable.', target: 'Implement green building codes, smart mobility, and waste management.' },
  { id: 12, name: 'Responsible Consumption & Prod', color: '#BF8B2E', icon: RefreshCw, desc: 'Ensure sustainable consumption and production patterns.', target: 'Circular economy systems, plastic-free alternatives, and upcycling.' },
  { id: 13, name: 'Climate Action', color: '#3F7E44', icon: Globe, desc: 'Take urgent action to combat climate change and its impacts.', target: 'Implement carbon capture, net-zero roadmaps, and micro-forests.' },
  { id: 14, name: 'Life Below Water', color: '#0A97D9', icon: Fish, desc: 'Conserve and sustainably use marine resources.', target: 'Reduce plastic pollution runoff, promote sustainable aquaculture.' },
  { id: 15, name: 'Life on Land', color: '#56C02B', icon: Trees, desc: 'Protect, restore and promote sustainable use of land.', target: 'Afforestation drives, biodiversity corridors, and soil rejuvenation.' },
  { id: 16, name: 'Peace, Justice & Strong Inst', color: '#00689D', icon: ShieldCheck, desc: 'Promote peaceful, inclusive societies for development.', target: 'Ensure transparent CSR funding allocation and ESG compliance.' },
  { id: 17, name: 'Partnerships for the Goals', color: '#19486A', icon: Handshake, desc: 'Strengthen global partnerships for sustainable development.', target: 'Connect startups with central ministries, global funds, and chambers.' },
];

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEventCompleted, setIsEventCompleted] = useState(false);
  const [hoveredSdg, setHoveredSdg] = useState<number | null>(null);
  const [selectedSdg, setSelectedSdg] = useState<typeof sdgData[0] | null>(sdgData[0]);
  const [joinStatus, setJoinStatus] = useState<'idle' | 'success'>('idle');
  const [joinRole, setJoinRole] = useState('entrepreneur');

  // SDG Auto-scroll state
  const [isSdgHovered, setIsSdgHovered] = useState(false);

  useEffect(() => {
    if (isSdgHovered) return;
    const timer = setInterval(() => {
      setSelectedSdg((prevSdg) => {
        if (!prevSdg) return sdgData[0];
        const currentIndex = sdgData.findIndex((sdg) => sdg.id === prevSdg.id);
        const nextIndex = (currentIndex + 1) % sdgData.length;
        return sdgData[nextIndex];
      });
    }, 4000); // cycle every 4 seconds

    return () => clearInterval(timer);
  }, [isSdgHovered]);

  // Coffee Table Book Download Modal state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookFormData, setBookFormData] = useState({ name: '', email: '', phone: '' });
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [bookError, setBookError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  // Animated stats counting up
  const [printCopies, setPrintCopies] = useState(0);
  const [digitalReach, setDigitalReach] = useState(0);

  useEffect(() => {
    let startPrint = 0;
    const endPrint = 5000;
    const durationPrint = 2000;
    const incrementPrint = Math.ceil(endPrint / (durationPrint / 30));

    let startDigital = 0;
    const endDigital = 500000;
    const durationDigital = 2000;
    const incrementDigital = Math.ceil(endDigital / (durationDigital / 30));

    const timer = setInterval(() => {
      startPrint += incrementPrint;
      startDigital += incrementDigital;

      if (startPrint >= endPrint) {
        setPrintCopies(endPrint);
      } else {
        setPrintCopies(startPrint);
      }

      if (startDigital >= endDigital) {
        setDigitalReach(endDigital);
        clearInterval(timer);
      } else {
        setDigitalReach(startDigital);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const formatIndianNumber = (num: number) => {
    const s = num.toString();
    if (s.length <= 3) return s;
    const lastThree = s.substring(s.length - 3);
    const otherNumbers = s.substring(0, s.length - 3);
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
    return formatted;
  };

  useEffect(() => {
    if (!isBookModalOpen) {
      setBookFormData({ name: '', email: '', phone: '' });
      setValidationErrors({});
      setBookError('');
    }
  }, [isBookModalOpen]);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookError('');
    setValidationErrors({});

    // Validation checks
    const errors: { name?: string; email?: string; phone?: string } = {};
    if (!bookFormData.name.trim() || bookFormData.name.trim().length < 3) {
      errors.name = 'Full name must be at least 3 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookFormData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(bookFormData.phone.trim())) {
      errors.phone = 'Mobile number must be exactly 10 digits.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setBookSubmitting(true);
    try {
      try {
        await submitContactEnquiry({
          name: bookFormData.name,
          email: bookFormData.email,
          phone: bookFormData.phone,
          interest: 'Book',
          message: 'Coffee Table Book Download: User requested to view/download the full book.'
        });
      } catch (apiErr: any) {
        console.warn('API submission failed, bypassing error locally/gracefully:', apiErr);
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          throw apiErr;
        }
      }
      window.open('/coffeetablebook.pdf', '_blank');
      setBookFormData({ name: '', email: '', phone: '' });
      setIsBookModalOpen(false);
    } catch (err: any) {
      setBookError(err.message || 'Failed to submit details. Please try again.');
    } finally {
      setBookSubmitting(false);
    }
  };


  // Real-time ticking metrics state
  const [metrics, setMetrics] = useState({
    trees: 1248390,
    co2: 450291,
    waste: 89120,
    jobs: 12450
  });

  useEffect(() => {
    // Target date: June 25, 2027 at 14:00:00 IST (UTC+5:30)
    const targetDate = new Date('2027-06-25T14:00:00+05:30');

    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsEventCompleted(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time metrics ticking
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setMetrics(prev => ({
        trees: prev.trees + Math.floor(Math.random() * 2) + 1,
        co2: prev.co2 + Math.floor(Math.random() * 2) + 1,
        waste: prev.waste + Math.floor(Math.random() * 2) + 1,
        jobs: prev.jobs + (Math.random() > 0.85 ? 1 : 0)
      }));
    }, 2800);
    return () => clearInterval(metricsInterval);
  }, []);



  const featuredStartups = [
    {
      name: 'Kiran Solar Labs',
      founder: 'Vikram Aditya',
      city: 'Pune',
      impact: '15,000+ Rural Homes Energized',
      tag: 'Affordable & Clean Energy',
      sdg: 7,
      desc: 'Developing low-cost smart solar microgrids tailored for rural agricultural MSMEs and remote farming clusters.',
      color: '#FCC30B'
    },
    {
      name: 'EcoCycle Solutions',
      founder: 'Rohan Shah',
      city: 'Ahmedabad',
      impact: '14,000 Tons Waste Diverted',
      tag: 'Responsible Consumption',
      sdg: 12,
      desc: 'Building automated waste segregation systems using AI and computer vision, achieving 98% purity in dry waste recyclables.',
      color: '#BF8B2E'
    },
    {
      name: 'JalDhara Filtration',
      founder: 'Dr. Meera Iyer',
      city: 'Bengaluru',
      impact: '3.2 Million Liters Recycled',
      tag: 'Clean Water & Sanitation',
      sdg: 6,
      desc: 'Bio-mimetic industrial effluent filters that extract organic dyes and heavy metals without using toxic chemicals.',
      color: '#26BDE2'
    },
    {
      name: 'AgriVeda Organics',
      founder: 'Suresh Kumar',
      city: 'Indore',
      impact: '4,500 Farmers Trained',
      tag: 'Life on Land',
      sdg: 15,
      desc: 'Creating microbial soil restoration inoculants that reduce urea dependencies by 60% while maintaining crop yield.',
      color: '#56C02B'
    }
  ];

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinStatus('success');
    setTimeout(() => {
      setJoinStatus('idle');
    }, 5000);
  };

  return (
    <div className="relative overflow-hidden bg-cream-white min-h-screen">
      {/* Visual background layers */}
      <div className="absolute inset-0 lottery-overlay lotus-pattern pointer-events-none z-0"></div>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[750px] lg:h-[880px] flex items-center overflow-hidden py-16 lg:py-0 bg-dark-green text-pure-white z-10">
        {/* Overlapping premium satin waves and metallic gold ribbon curves */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#02110B] via-[#052216] to-[#0A5C36] opacity-90"></div>
          
          {/* Custom SVG satin ribbons & metallic gold flows based on user images */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gold-satin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#AA771C" />
                <stop offset="20%" stopColor="#FCF6BA" />
                <stop offset="40%" stopColor="#B38728" />
                <stop offset="60%" stopColor="#FBF5B7" />
                <stop offset="80%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#AA771C" />
              </linearGradient>
              <linearGradient id="emerald-satin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#02110B" />
                <stop offset="35%" stopColor="#052216" />
                <stop offset="70%" stopColor="#0B5B3E" />
                <stop offset="100%" stopColor="#107C54" />
              </linearGradient>
              <linearGradient id="emerald-satin-bright" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#052216" />
                <stop offset="50%" stopColor="#0B5B3E" />
                <stop offset="100%" stopColor="#159A64" />
              </linearGradient>
            </defs>
            
            {/* Rich Emerald Flowing Ribbon */}
            <path d="M0,150 C300,50 600,300 900,100 C1200,-100 1350,150 1440,80 L1440,800 L0,800 Z" fill="url(#emerald-satin-grad)" />
            
            {/* Metallic Gold Flowing Satin Ribbon */}
            <path d="M0,170 C300,70 600,320 900,120 C1200,-80 1350,170 1440,100 L1440,115 C1350,185 1200,-65 900,135 C600,335 300,85 0,185 Z" fill="url(#gold-satin)" />
            
            {/* Secondary Emerald Overlay */}
            <path d="M0,220 C400,120 700,380 1000,180 C1250,50 1380,220 1440,170 L1440,800 L0,800 Z" fill="url(#emerald-satin-bright)" opacity="0.35" />
            
            {/* Thin Secondary Gold highlight */}
            <path d="M0,230 C400,130 700,390 1000,190 C1250,60 1380,230 1440,180 L1440,185 C1380,235 1250,65 1000,195 C700,395 400,135 0,235 Z" fill="url(#gold-satin)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-saffron/15 border border-[#B38728]/40 backdrop-blur-md">
              <div className="w-2.5 h-2.5 bg-saffron rounded-full animate-ping"></div>
              <span className="text-saffron text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">
                Viksit Bharat @2047 Platform
              </span>
            </div>

            <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl font-black text-pure-white mb-6 leading-[1.1] tracking-tight">
              Empowering <span className="text-gold-metallic italic">Green</span> <br />
              Entrepreneurs for <br />
              <span className="text-gold-metallic">Viksit Bharat</span>
            </h1>

            <p className="text-base sm:text-lg text-pure-white/80 mb-10 font-normal leading-relaxed max-w-2xl font-inter">
              India's premier digital hub uniting youth entrepreneurship, ecological innovation, and national pride. We accelerate eco-conscious business builders aligned with the 17 UN SDGs to shape a developed, net-zero nation by 2047.
            </p>

            <div className="flex flex-wrap items-center gap-5 mb-10">
              <Link
                to="/awards/apply"
                className="px-8 py-4 bg-gold-metallic text-dark-green font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-md hover:shadow-gold-lux hover:scale-102 hover:-translate-y-0.5 transition-all group rounded-lg"
              >
                Nominate Your Startup
                <Award className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
              </Link>
              <Link
                to="/event-2027"
                className="px-8 py-4 border border-[#B38728] text-[#B38728] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#B38728]/10 transition-all rounded-lg"
              >
                Get Delegate Pass
              </Link>
              <Link
                to="/community#join-form"
                className="px-8 py-4 border border-[#B38728] text-[#B38728] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#B38728]/10 transition-all rounded-lg"
              >
                Join Our Community
              </Link>
            </div>

            {/* Quick legacy stats */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 border-t border-pure-white/10 pt-8 max-w-xl">
              <div>
                <span className="block text-3xl font-playfair font-black text-gold-metallic mb-1">05th</span>
                <span className="text-pure-white/40 text-[12px] uppercase tracking-[0.2em] font-bold">
                  Annual Edition
                </span>
              </div>
              <div>
                <span className="block text-3xl font-playfair font-black text-pure-white mb-1">500+</span>
                <span className="text-pure-white/40 text-[12px] uppercase tracking-[0.2em] font-bold">
                  Delegates
                </span>
              </div>
              <div>
                <span className="block text-3xl font-playfair font-black text-gold-metallic mb-1">17</span>
                <span className="text-pure-white/40 text-[12px] uppercase tracking-[0.2em] font-bold">
                  SDGs Aligned
                </span>
              </div>
            </div>
          </div>

          {/* Graphical Centerpiece: Spinning multicolor SDG Wheel with Ashoka Chakra & Trophy Base */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative select-none mt-10 lg:mt-0 group">
            {/* Spinning Halo */}
            <div className="absolute -inset-10 bg-radial from-[#B38728]/20 via-[#0B5B3E]/10 to-transparent blur-2xl group-hover:from-[#B38728]/40 transition-all duration-700 animate-pulse"></div>
            
            {/* The SDG Wheel (Trophy Top) */}
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-500">
              
              {/* Spinning Container for both outer wheel and inner chakra */}
              <div className="w-full h-full absolute inset-0 animate-spin-slow origin-center">
                {/* SDG Outer Wheel */}
                <svg className="w-full h-full drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100">
                  {sdgData.map((sdg, index) => {
                    const segmentAngle = 360 / 17;
                    const startAngle = index * segmentAngle;
                    const endAngle = startAngle + segmentAngle;
                    const radStart = (startAngle - 90) * (Math.PI / 180);
                    const radEnd = (endAngle - 90) * (Math.PI / 180);
                    const radiusInner = 32;
                    const radiusOuter = 48;

                    const x1 = 50 + radiusInner * Math.cos(radStart);
                    const y1 = 50 + radiusInner * Math.sin(radStart);
                    const x2 = 50 + radiusOuter * Math.cos(radStart);
                    const y2 = 50 + radiusOuter * Math.sin(radStart);
                    const x3 = 50 + radiusOuter * Math.cos(radEnd);
                    const y3 = 50 + radiusOuter * Math.sin(radEnd);
                    const x4 = 50 + radiusInner * Math.cos(radEnd);
                    const y4 = 50 + radiusInner * Math.sin(radEnd);

                    return (
                      <path
                        key={sdg.id}
                        d={`M ${x1} ${y1} L ${x2} ${y2} A ${radiusOuter} ${radiusOuter} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${radiusInner} ${radiusInner} 0 0 0 ${x1} ${y1} Z`}
                        fill={sdg.color}
                        className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                        onClick={() => setSelectedSdg(sdg)}
                      />
                    );
                  })}
                </svg>

                {/* Ashoka Chakra in the center (Navy Blue, 24 spokes) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[58%] h-[58%] bg-pure-white rounded-full border-4 border-ashoka-navy shadow-inner flex items-center justify-center p-2 z-10">
                    <svg className="w-full h-full text-ashoka-navy" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2.5" />
                      <circle cx="50" cy="50" r="8" fill="currentColor" />
                      {/* spokes */}
                      {Array.from({ length: 24 }).map((_, i) => {
                        const angle = i * (360 / 24);
                        return (
                          <line
                            key={i}
                            x1="50"
                            y1="50"
                            x2={50 + 43 * Math.cos((angle * Math.PI) / 180)}
                            y2={50 + 43 * Math.sin((angle * Math.PI) / 180)}
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        );
                      })}
                      {/* outer dots */}
                      {Array.from({ length: 24 }).map((_, i) => {
                        const angle = i * (360 / 24);
                        return (
                          <circle
                            key={i}
                            cx={50 + 44 * Math.cos((angle * Math.PI) / 180)}
                            cy={50 + 44 * Math.sin((angle * Math.PI) / 180)}
                            r="1.2"
                            fill="currentColor"
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Trophy Pedestal Base (Flat and Wide, properly attached to circle) */}
            <div className="relative z-0 -mt-2 sm:-mt-3 md:-mt-4 pointer-events-none transition-all duration-500 flex justify-center">
              <svg viewBox="0 0 500 120" className="w-[280px] sm:w-[350px] md:w-[420px] h-auto drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)]">
                <defs>
                  <linearGradient id="marble" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1c1f26" />
                    <stop offset="15%" stopColor="#2c303a" />
                    <stop offset="35%" stopColor="#414654" />
                    <stop offset="50%" stopColor="#252932" />
                    <stop offset="70%" stopColor="#3c414e" />
                    <stop offset="85%" stopColor="#20232b" />
                    <stop offset="100%" stopColor="#121418" />
                  </linearGradient>
                  <linearGradient id="edge-light" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5b616e" />
                    <stop offset="100%" stopColor="#2a2e37" />
                  </linearGradient>
                  <linearGradient id="edge-dark" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1a1c22" />
                    <stop offset="100%" stopColor="#0d0e11" />
                  </linearGradient>
                  <linearGradient id="gold-text" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#BF953F" />
                    <stop offset="50%" stopColor="#FCF6BA" />
                    <stop offset="100%" stopColor="#B38728" />
                  </linearGradient>
                </defs>

                <g>
                  {/* Neck (connects wheel to base) */}
                  <rect x="210" y="0" width="80" height="20" fill="url(#marble)" />
                  
                  {/* Top thin lip */}
                  <rect x="50" y="20" width="400" height="6" rx="1" fill="url(#edge-light)" />
                  <path d="M50 26 L450 26 L455 34 L45 34 Z" fill="url(#edge-dark)" />
                  
                  {/* Main Flat Block */}
                  <rect x="45" y="34" width="410" height="46" fill="url(#marble)" />
                  
                  {/* Bottom Bevels */}
                  <path d="M45 80 L455 80 L465 90 L35 90 Z" fill="url(#edge-dark)" />
                  <rect x="35" y="90" width="430" height="6" rx="1" fill="url(#edge-light)" />
                  <path d="M35 96 L465 96 L470 104 L30 104 Z" fill="url(#edge-dark)" />
                  
                  {/* Engraved Text */}
                  <text x="250" y="65" fill="url(#gold-text)" fontSize="24" className="font-playfair font-bold uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-[0.2em]" textAnchor="middle">
                    Greenpreneur Awards
                  </text>
                  
                  {/* Bottom Base Lip */}
                  <rect x="30" y="104" width="440" height="12" rx="2" fill="#111216" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COUNTDOWN TIMER */}
      <section className="py-10 bg-pure-white border-y border-light-grey relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <span className="text-[#B38728] font-black tracking-[0.2em] uppercase text-xs block mb-1">
                Conclave Countdown
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl text-dark-green font-black leading-tight">
                25 June 2027 • Ahmedabad
              </h2>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-medium-grey mt-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B38728] shrink-0" />
                  Renaissance by Marriott Hotel
                </span>
                <span className="hidden sm:inline text-light-grey">|</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B38728] shrink-0" />
                  2:00 PM – 9:30 PM IST
                </span>
              </div>
            </div>

            {/* Timer boxes */}
            <div className="flex items-center gap-3 sm:gap-4">
              {isEventCompleted ? (
                <div className="font-playfair text-lg sm:text-xl text-indian-green font-bold bg-cream-white border border-[#B38728]/20 px-6 py-4 rounded-xl shadow-sm">
                  Event Ongoing / Completed — See Winners 2027
                </div>
              ) : (
                [
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Minutes', val: timeLeft.minutes },
                  { label: 'Seconds', val: timeLeft.seconds },
                ].map((box, i) => (
                  <div
                    key={i}
                    className="w-16 h-20 sm:w-20 sm:h-24 bg-cream-white rounded-xl flex flex-col items-center justify-center shadow-sm border border-[#B38728]/20 hover:border-[#B38728]/50 transition-all duration-300"
                  >
                    <span className="text-2xl sm:text-3xl font-playfair font-black text-dark-green">
                      {String(box.val).padStart(2, '0')}
                    </span>
                    <span className="text-[12px] uppercase tracking-wider text-medium-grey font-bold mt-1">
                      {box.label}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div>
              <Link
                to="/event-2027"
                className="px-6 py-3.5 bg-gold-metallic text-dark-green text-xs uppercase tracking-widest font-black hover:shadow-gold-lux hover:scale-102 transition-all inline-block rounded-md"
              >
                Register as Delegate →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: 17 UN SDGs INTERACTIVE GRID */}
      <section className="py-24 bg-pure-white relative z-10">
        <div 
          className="max-w-7xl mx-auto px-6"
          onMouseEnter={() => setIsSdgHovered(true)}
          onMouseLeave={() => setIsSdgHovered(false)}
        >
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-[#B38728] font-black uppercase tracking-[0.3em] text-xs mb-3 block">
              17 UN Sustainable Development Goals
            </span>
            <h2 className="font-playfair text-4xl sm:text-5xl text-dark-green font-black leading-tight mb-4">
              The SDG Integration Wheel
            </h2>
            <p className="text-medium-grey font-inter text-sm sm:text-base leading-relaxed">
              Every green business targets a specific sustainability challenge. Hover over any of the 17 SDG tiles to see how greenpreneurs drive global solutions. Click to inspect target profiles.
            </p>
          </div>

          {/* Selected SDG Detail Card (Dynamic Showcase - Swapped to Top) */}
          <div className="max-w-4xl mx-auto mb-10 bg-pure-white rounded-3xl border border-light-grey/80 border-l-[8px] p-8 shadow-sm transition-all duration-500 relative"
               style={{ borderLeftColor: selectedSdg ? selectedSdg.color : '#B38728' }}>
            {selectedSdg ? (
              <div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-pure-white shrink-0 shadow-md"
                       style={{ backgroundColor: selectedSdg.color }}>
                    {(() => {
                      const IconComp = selectedSdg.icon;
                      return <IconComp className="w-9 h-9" />;
                    })()}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: selectedSdg.color }}>
                      Goal #{selectedSdg.id} • UN SDG Profile
                    </span>
                    <h3 className="font-playfair text-2xl sm:text-3xl font-black text-dark-green mt-1 mb-3">
                      {selectedSdg.name}
                    </h3>
                    <p className="text-gray-700 text-sm font-semibold mb-4 leading-relaxed">
                      {selectedSdg.desc}
                    </p>
                    <div className="bg-cream-white border border-light-grey/60 rounded-xl p-4">
                      <span className="text-[10px] text-medium-grey font-black uppercase tracking-wider block mb-1">
                        Greenpreneur Business Focus:
                      </span>
                      <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                        {selectedSdg.target}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 flex flex-col items-center justify-center">
                <Info className="w-8 h-8 text-[#B38728] mb-2 animate-bounce" />
                <span className="text-sm font-semibold">Click on any SDG tile below to view its business target profiles.</span>
              </div>
            )}
          </div>

          {/* Grid Layout (Swapped to Bottom) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3.5 max-w-6xl mx-auto">
            {sdgData.map((sdg) => {
              const IconComp = sdg.icon;
              const isHovered = hoveredSdg === sdg.id;
              const isSelected = selectedSdg?.id === sdg.id;

              return (
                <button
                  key={sdg.id}
                  onMouseEnter={() => {
                    setHoveredSdg(sdg.id);
                    setSelectedSdg(sdg);
                  }}
                  onMouseLeave={() => setHoveredSdg(null)}
                  onClick={() => setSelectedSdg(sdg)}
                  style={{ 
                    backgroundColor: sdg.color,
                    boxShadow: isHovered ? `0 12px 28px -5px ${sdg.color}77` : 'none',
                    transform: isHovered || isSelected ? 'translateY(-6px) scale(1.03)' : 'none'
                  }}
                  className="aspect-square p-3 text-pure-white flex flex-col justify-between rounded-xl relative transition-all duration-300 select-none cursor-pointer outline-none border border-black/5"
                  aria-label={sdg.name}
                >
                  <span className="text-lg font-black leading-none">{sdg.id}</span>
                  <div className="w-full flex justify-center py-2 text-pure-white/90">
                    <IconComp className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <span className="text-[7.5px] leading-tight font-black uppercase opacity-95 text-center truncate w-full block">
                    {sdg.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: SDG IMPACT TRACKER DASHBOARD */}
      <section className="py-24 bg-cream-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Impact text */}
            <div className="lg:col-span-5 text-left">
              <span className="text-[#B38728] font-black uppercase tracking-[0.3em] text-xs block mb-3">
                Live Performance Tracker
              </span>
              <h2 className="font-playfair text-4xl sm:text-5xl text-dark-green font-black mb-6 leading-tight">
                SDG Impact Tracker
              </h2>
              <p className="text-gray-600 font-inter text-sm sm:text-base leading-relaxed mb-6 font-semibold">
                Our greenpreneurs deliver real, verifiable improvements. Through CSR collaborations and structured ESG initiatives, our members track trees planted, carbon reductions, circular economy waste streams, and employment in real-time.
              </p>
              
              {/* Target Indicator progress */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-dark-green mb-1.5">
                    <span>National Net-Zero Carbon Target</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full h-3 bg-light-grey rounded-full overflow-hidden">
                    <div className="h-full bg-gold-metallic rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-dark-green mb-1.5">
                    <span>Green Business Transition</span>
                    <span>48%</span>
                  </div>
                  <div className="w-full h-3 bg-light-grey rounded-full overflow-hidden">
                    <div className="h-full bg-gold-metallic rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Counters */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {label: 'Trees Planted', val: metrics.trees, color: '#0B5B3E', unit: 'Young Trees Planted', icon: Trees, shadow: 'glow-indian-green'},
                { label: 'Carbon Saved', val: metrics.co2, color: '#B38728', unit: 'Tons Saved', icon: Globe, shadow: 'shadow-gold-lux' },
                { label: 'Waste Recycled', val: metrics.waste, color: '#AB833C', unit: 'Tons Recycled', icon: RefreshCw, shadow: '' },
                { label: 'Green Jobs Created', val: metrics.jobs, color: '#0C1B33', unit: 'Careers Started', icon: Users, shadow: 'glow-ashoka-navy' }
              ].map((m, idx) => {
                const IconComp = m.icon;
                return (
                  <div 
                    key={idx}
                    className={`bg-pure-white p-8 border border-light-grey/80 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-md ${m.shadow}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-medium-grey">
                        {m.label}
                      </span>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}15`, color: m.color }}>
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="block font-playfair text-3xl font-black text-dark-green leading-none mb-1">
                        {m.val.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-medium-grey tracking-wider uppercase">
                        {m.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE PILLARS */}
      <section className="py-24 bg-pure-white relative z-10 border-y border-light-grey">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <span className="text-[#B38728] font-black uppercase tracking-[0.4em] text-xs mb-3 block">
            Core Philosophy
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl text-dark-green font-black">
            The Three Pillars of Action
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1: Award */}
          <div className="bg-cream-white p-10 text-center rounded-2xl border-t-4 border-[#B38728] shadow-sm hover:shadow-md transition-all duration-300 relative group">
            <div className="w-16 h-16 bg-[#B38728]/10 flex items-center justify-center mx-auto mb-8 text-[#B38728] group-hover:bg-gold-metallic group-hover:text-dark-green transition-all rounded-xl shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-playfair text-2xl font-black mb-4 text-dark-green tracking-tight">AWARD</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed font-semibold">
              Recognize and celebrate green business excellence across 35+ categories through a rigorous Speakers & jury evaluation.
            </p>
            <Link
              to="/awards/overview"
              className="text-xs uppercase tracking-widest font-black text-[#B38728] hover:text-dark-green flex items-center justify-center gap-2"
            >
              Learn Award System <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Connect */}
          <div className="bg-cream-white p-10 text-center rounded-2xl border-t-4 border-[#0C1B33] shadow-sm hover:shadow-md transition-all duration-300 relative group">
            <div className="w-16 h-16 bg-[#B38728]/10 flex items-center justify-center mx-auto mb-8 text-[#B38728] group-hover:bg-gold-metallic group-hover:text-dark-green transition-all rounded-xl shadow-inner">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-playfair text-2xl font-black mb-4 text-dark-green tracking-tight">CONNECT</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed font-semibold">
              Build permanent green business networks, meet investors, corporate ESG heads, and policy makers at the conclave.
            </p>
            <Link
              to="/community"
              className="text-xs uppercase tracking-widest font-black text-[#B38728] hover:text-dark-green flex items-center justify-center gap-2"
            >
              Explore Network <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Promote */}
          <div className="bg-cream-white p-10 text-center rounded-2xl border-t-4 border-[#0B5B3E] shadow-sm hover:shadow-md transition-all duration-300 relative group">
            <div className="w-16 h-16 bg-[#B38728]/10 flex items-center justify-center mx-auto mb-8 text-[#B38728] group-hover:bg-gold-metallic group-hover:text-dark-green transition-all rounded-xl shadow-inner">
              <Megaphone className="w-8 h-8" />
            </div>
            <h3 className="font-playfair text-2xl font-black mb-4 text-dark-green tracking-tight">PROMOTE</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed font-semibold">
              Publish stories of 1,000+ green entrepreneurs on VyapaarJagat.com and feature leaders in our premium Coffee Table Book.
            </p>
            <Link
              to="/coffee-table-book"
              className="text-xs uppercase tracking-widest font-black text-[#B38728] hover:text-dark-green flex items-center justify-center gap-2"
            >
              Read Stories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: TWO AWARD TRACKS */}
      <section className="py-24 bg-pure-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#B38728] font-black uppercase tracking-[0.4em] text-xs mb-3 block">
              Nomination Pathways
            </span>
            <h2 className="font-playfair text-4xl sm:text-5xl text-dark-green font-black">
              Two Tracks of Excellence
            </h2>
            <p className="text-medium-grey text-sm mt-3 font-semibold font-inter">
              Understand our nomination types clearly to select the best fit for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Track 1: Honorary */}
            <div className="bg-cream-white p-10 rounded-2xl border-t-8 border-[#B38728] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-[#B38728] tracking-[0.3em] uppercase mb-4 block">
                  Track One
                </span>
                <h3 className="font-playfair text-3xl text-dark-green font-black mb-6">
                  Honorary Recognition
                </h3>
                <p className="text-gray-600 mb-8 text-sm leading-relaxed font-semibold">
                  Dedicated to lifetime achievers, pioneering policy advocacy, and exceptional sector contributors. Evaluation is based on merit, vetted entirely by our expert Speakers & jury panel.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-sm text-gray-700 font-bold">
                    <Check className="w-5 h-5 text-[#B38728] shrink-0" />
                    <span>Nomination is completely <span className="text-[#B38728]">FREE</span></span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 font-bold">
                    <Check className="w-5 h-5 text-[#B38728] shrink-0" />
                    <span>100% Vetted by Speakers & Jury Panel</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 font-bold">
                    <Check className="w-5 h-5 text-[#B38728] shrink-0" />
                    <span>Invitation or Self-Nomination pathway</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/awards/apply"
                className="w-full py-4 text-center bg-gold-metallic text-dark-green font-black uppercase tracking-[0.2em] text-[11px] hover:shadow-gold-lux transition-all shadow-md rounded-lg"
              >
                Apply for Honorary Award (FREE)
              </Link>
            </div>

            {/* Track 2: Rated Challenge */}
            <div className="bg-cream-white p-10 rounded-2xl border-t-8 border-[#0B5B3E] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-[#0B5B3E] tracking-[0.3em] uppercase mb-4 block">
                  Track Two
                </span>
                <h3 className="font-playfair text-3xl text-dark-green font-black mb-6">
                  The Rated Challenge
                </h3>
                <p className="text-gray-600 mb-8 text-sm leading-relaxed font-semibold">
                  A structured challenge framework designed specifically for startups, MSMEs, and entrepreneurs. Combines 75% expert Speakers & jury marks with 25% public validation to drive maximum organic visibility.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-sm text-gray-700 font-bold">
                    <Check className="w-5 h-5 text-[#0B5B3E] shrink-0" />
                    <span>Nomination fee: Rs. 2,000 (Standard) / Rs. 5,000 (Premium)</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 font-bold">
                    <Check className="w-5 h-5 text-[#0B5B3E] shrink-0" />
                    <span>Speakers & Jury Vetting (75%) + Public Votes (25%)</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700 font-bold">
                    <Check className="w-5 h-5 text-[#0B5B3E] shrink-0" />
                    <span>Includes marketing templates & VyapaarJagat editorial</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/awards/apply"
                className="w-full py-4 text-center bg-gold-metallic text-dark-green font-black uppercase tracking-[0.2em] text-[11px] hover:shadow-gold-lux hover:scale-102 transition-all shadow-md rounded-lg"
              >
                Join Rated Challenge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: VIKSIT BHARAT @2047 ALIGNMENT */}
      <section className="py-24 bg-cream-white relative z-10 border-t border-light-grey">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2 text-left">
              <span className="text-[#B38728] font-black uppercase tracking-[0.3em] text-xs mb-3 block">
                National Integration
              </span>
              <h2 className="font-playfair text-4xl sm:text-5xl text-dark-green font-black mb-6 leading-tight">
                Viksit Bharat @2047 & <br />
                <span className="italic text-[#B38728]">UN SDG Alignment</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed font-semibold text-sm sm:text-base">
                Our greenpreneur network drives India's goal of achieving self-reliance and complete decarbonization by **2047**. By linking global SDGs with local MSME actions, we build clean power arrays, implement zero-waste circular loops, and fund grassroots green jobs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-[#B38728]/10 text-[#B38728] flex items-center justify-center rounded-xl shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-green text-sm mb-1">Decarbonization</h4>
                    <p className="text-xs text-medium-grey font-medium">Phasing out carbon footprint via micro-solar grids and clean thermal tech.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-[#0B5B3E]/10 text-[#0B5B3E] flex items-center justify-center rounded-xl shrink-0">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-green text-sm mb-1">Circular Systems</h4>
                    <p className="text-xs text-medium-grey font-medium">Eliminating toxic waste through comprehensive local sorting and upcycling.</p>
                  </div>
                </div>
              </div>

              {/* National Identity Lotus Emblem */}
              <div className="flex items-center gap-6 p-4 bg-pure-white border border-[#B38728]/25 rounded-xl max-w-md">
                <div className="w-20 h-20 rounded-full border border-[#B38728] bg-pure-white flex flex-col items-center justify-center p-2 text-center shrink-0 shadow-inner" style={{ boxShadow: 'inset 0 0 10px rgba(179,135,40,0.1)' }}>
                  <span className="text-[6.5px] text-medium-grey uppercase leading-none font-bold">India</span>
                  <span className="text-xs font-playfair font-black text-dark-green leading-tight">VIKSIT BHARAT</span>
                  <span className="text-[12px] font-bold text-[#B38728] tracking-wider">@2047</span>
                </div>
                <div>
                  <span className="text-xs font-black text-ashoka-navy uppercase tracking-wider block">National Agenda Alignment</span>
                  <p className="text-xs text-medium-grey leading-relaxed mt-1 font-semibold">Supporting key ministries in promoting sustainable technology and green jobs in rural areas.</p>
                </div>
              </div>
            </div>

            {/* UN SDG visual color boxes */}
            <div className="lg:w-1/2 grid grid-cols-4 gap-3">
              {[
                { num: 7, name: 'Affordable & Clean Energy', color: '#FCC30B', icon: Zap },
                { num: 8, name: 'Decent Work & Growth', color: '#A21942', icon: TrendingUp },
                { num: 9, name: 'Industry & Infrastructure', color: '#FD6925', icon: Cpu },
                { num: 11, name: 'Sustainable Cities', color: '#FD9D24', icon: HomeIcon },
                { num: 12, name: 'Responsible Consumption', color: '#BF8B2E', icon: RefreshCw },
                { num: 13, name: 'Climate Action', color: '#3F7E44', icon: Globe },
                { num: 15, name: 'Life on Land', color: '#56C02B', icon: Trees },
                { num: 17, name: 'Partnerships for Goals', color: '#19486A', icon: Handshake },
              ].map((sdg) => {
                const IconComp = sdg.icon;
                return (
                  <div
                    key={sdg.num}
                    style={{ backgroundColor: sdg.color }}
                    className="aspect-square p-3 text-pure-white flex flex-col justify-between rounded-xl shadow-sm hover:scale-105 transition-all select-none cursor-pointer"
                    title={sdg.name}
                  >
                    <span className="text-lg font-black leading-none">{sdg.num}</span>
                    <div className="w-full flex justify-center py-1.5 opacity-90">
                      <IconComp className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <span className="text-[7.5px] leading-tight font-black uppercase opacity-95 hidden sm:block text-center truncate">
                      {sdg.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: GREEN STARTUP STORIES */}
      <section className="py-24 bg-pure-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#B38728] font-black uppercase tracking-[0.3em] text-xs mb-3 block">
              Success Case Studies
            </span>
            <h2 className="font-playfair text-4xl sm:text-5xl text-dark-green font-black">
              Green Startup Stories
            </h2>
            <p className="text-medium-grey text-sm mt-3 font-semibold font-inter">
              Read how innovative entrepreneurs build green ecosystems and circular business models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {featuredStartups.map((startup, idx) => (
              <div 
                key={idx}
                className="bg-pure-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between border border-light-grey/80 border-t-4"
                style={{ borderTopColor: startup.color }}
              >
                <div className="p-6 text-left">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-[12px] font-black tracking-wider uppercase mb-4 text-pure-white"
                    style={{ backgroundColor: startup.color }}
                  >
                    SDG {startup.sdg} • {startup.tag.split(' ')[0]}
                  </span>
                  <h4 className="font-playfair text-2xl font-black text-dark-green mb-1">
                    {startup.name}
                  </h4>
                  <span className="text-[10px] text-medium-grey font-bold uppercase tracking-wider block mb-3">
                    Founder: {startup.founder} ({startup.city})
                  </span>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-4">
                    {startup.desc}
                  </p>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-light-grey bg-[#FCFBF9] flex justify-between items-center mt-auto">
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-medium-grey uppercase font-black tracking-wider leading-none">Impact Focus</span>
                    <span className="text-[11px] font-extrabold text-dark-green mt-1">{startup.impact}</span>
                  </div>
                  <Link 
                    to="/community"
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-pure-white cursor-pointer"
                    style={{ backgroundColor: startup.color }}
                    aria-label={`Read ${startup.name} story`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION - HALL OF GREEN GALLERY */}
      <HallOfGreen />

      {/* Real-time Google Reviews Widget */}
      <GoogleReviews />

      {/* SECTION 9: THE COFFEE TABLE BOOK (REDESIGNED & ANIMATED) */}
      <section className="section gp-book-section py-24 text-dark-green relative overflow-hidden z-10 border-y border-light-grey">
        <style dangerouslySetInnerHTML={{__html: `
          .eyebrow-pulsing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #B38728;
            box-shadow: 0 0 0 0 rgba(179, 135, 40, 0.6);
            animation: gp-dotpulse 2.2s ease-out infinite;
          }
          @keyframes gp-dotpulse {
            0% { box-shadow: 0 0 0 0 rgba(179, 135, 40, 0.55); }
            70% { box-shadow: 0 0 0 8px rgba(179, 135, 40, 0); }
            100% { box-shadow: 0 0 0 0 rgba(179, 135, 40, 0); }
          }

          .grad-text-animated {
            font-style: italic;
            background: linear-gradient(90deg, #0B5B3E 0%, #1d9e75 45%, #2563eb 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gp-shine 6s linear infinite;
          }
          @keyframes gp-shine {
            to { background-position: 200% center; }
          }

          .gp-ambient-leaf {
            animation: gp-drift 12s linear infinite;
            will-change: transform;
          }
          @keyframes gp-drift {
            0%   { transform: translate(0,0) rotate(0deg); }
            50%  { transform: translate(-24px,-40px) rotate(160deg); }
            100% { transform: translate(0,0) rotate(360deg); }
          }

          .gp-halo {
            position: absolute;
            width: 420px;
            height: 420px;
            border-radius: 50%;
            background:
              radial-gradient(circle at 35% 30%, rgba(11, 91, 62, 0.25), transparent 60%),
              radial-gradient(circle at 65% 70%, rgba(37, 99, 235, 0.20), transparent 60%);
            filter: blur(10px);
            animation: gp-pulse 7s ease-in-out infinite;
          }
          @keyframes gp-pulse {
            0%, 100% { transform: scale(1); opacity: 0.45; }
            50% { transform: scale(1.15); opacity: 0.65; }
          }

          .gp-ring {
            position: absolute;
            width: 460px;
            height: 460px;
            border-radius: 50%;
            border: 1.5px dashed rgba(11, 91, 62, 0.25);
            animation: gp-spin 45s linear infinite;
          }
          .gp-ring.ring2 {
            width: 520px;
            height: 520px;
            border-color: rgba(37, 99, 235, 0.18);
            animation-duration: 65s;
            animation-direction: reverse;
          }
          @keyframes gp-spin {
            to { transform: rotate(360deg); }
          }

          .gp-orbit-leaf {
            position: absolute;
            width: 460px;
            height: 460px;
            animation: gp-spin 45s linear infinite;
          }
          .gp-orbit-leaf span {
            position: absolute;
            top: -11px;
            left: 50%;
            transform: translateX(-50%);
          }

          .gp-book-card {
            position: relative;
            animation: gp-floaty 6s ease-in-out infinite;
            z-index: 2;
          }
          @keyframes gp-floaty {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-16px) rotate(0.5deg); }
          }

          .gp-badge {
            animation: gp-dotpulse2 3s ease-in-out infinite;
          }
          @keyframes gp-dotpulse2 {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.06) rotate(-4deg); }
          }

          .gp-book-section {
            background:
              radial-gradient(60% 50% at 85% 10%, rgba(37,99,235,0.06), transparent 60%),
              radial-gradient(50% 45% at 10% 90%, rgba(11,91,62,0.08), transparent 60%),
              linear-gradient(180deg, #eaf7ff 0%, #f3fbef 100%);
          }
        `}} />

        {/* Ambient Leaves and glow orbs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-[340px] h-[340px] top-[-80px] right-[8%] bg-[radial-gradient(circle,rgba(37,99,235,0.15),transparent_70%)] rounded-full blur-[60px] animate-[pulse_8s_ease-in-out_infinite]"></div>
          <div className="absolute w-[280px] h-[280px] bottom-[-60px] left-[4%] bg-[radial-gradient(circle,rgba(11,91,62,0.2),transparent_70%)] rounded-full blur-[60px] animate-[pulse_8s_ease-in-out_infinite] [animation-delay:2s]"></div>
          
          {/* Leaf 1 */}
          <div className="absolute top-[15%] left-[5%] gp-ambient-leaf opacity-60">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#0B5B3E"><path d="M12 2C8 6 4 10 4 15a8 8 0 0 0 16 0c0-5-4-9-8-13z"/></svg>
          </div>
          {/* Leaf 2 */}
          <div className="absolute bottom-[20%] right-[10%] gp-ambient-leaf opacity-40 [animation-delay:3s]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1d9e75"><path d="M12 2C8 6 4 10 4 15a8 8 0 0 0 16 0c0-5-4-9-8-13z"/></svg>
          </div>
          {/* Leaf 3 */}
          <div className="absolute top-[40%] right-[45%] gp-ambient-leaf opacity-30 [animation-delay:5s]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#2d7f36"><path d="M12 2C8 6 4 10 4 15a8 8 0 0 0 16 0c0-5-4-9-8-13z"/></svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column (Text & CTAs) */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2.5 text-xs sm:text-xs font-bold tracking-[0.22em] uppercase text-[#B38728] bg-[#B38728]/10 px-4 py-2 rounded-full border border-[#B38728]/35 mb-6">
                <span className="eyebrow-pulsing-dot"></span>
                Premium Publication
              </div>
              
              <h2 className="font-playfair text-4xl sm:text-6xl font-black mb-6 leading-tight text-dark-green">
                Top 50 Sustainable <br />
                <span className="grad-text-animated">Leaders Book</span>
              </h2>
              
              <p className="text-medium-grey text-base sm:text-lg mb-8 font-medium leading-relaxed font-inter max-w-lg">
                An archival masterpiece documenting the stories and models of India's top 50 sustainability visionaries — shared with central ministries, corporate buyers, and libraries across India.
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mb-10">
                {/* Stat 1 */}
                <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(15,59,36,0.06)] min-w-[180px] flex-1 sm:flex-initial">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B5B3E]/10 to-[#2563eb]/10 flex items-center justify-center text-[#0B5B3E] shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-playfair font-black text-2xl text-dark-green">{printCopies}+</span>
                    <span className="text-[10px] uppercase tracking-wider text-medium-grey font-bold mt-1">
                      Print Copies
                    </span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(15,59,36,0.06)] min-w-[180px] flex-1 sm:flex-initial">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B5B3E]/10 to-[#2563eb]/10 flex items-center justify-center text-[#0B5B3E] shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-playfair font-black text-2xl text-dark-green">{formatIndianNumber(digitalReach)}+</span>
                    <span className="text-[10px] uppercase tracking-wider text-medium-grey font-bold mt-1">
                      Digital Reach
                    </span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  to="/coffee-table-book"
                  className="btn-shimmer px-8 py-4 bg-gold-metallic text-dark-green font-black text-xs uppercase tracking-[0.2em] hover:shadow-gold-lux hover:-translate-y-0.5 active:scale-95 transition-all duration-300 rounded-lg flex items-center justify-center"
                >
                  Feature My Business
                </Link>
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="btn-shimmer px-8 py-4 bg-gold-metallic text-dark-green font-black text-xs uppercase tracking-[0.2em] hover:shadow-gold-lux hover:-translate-y-0.5 active:scale-95 transition-all duration-300 rounded-lg cursor-pointer flex items-center justify-center"
                >
                  COFFEETABLE BOOK
                </button>
              </div>
            </div>

            {/* Right Column (Visual Mockup & Orbit Animations) */}
            <div className="relative flex items-center justify-center h-[460px] sm:h-[560px] perspective-[1200px]">
              <div className="gp-halo"></div>
              <div className="gp-ring"></div>
              <div className="gp-ring ring2"></div>
              
              <div className="gp-orbit-leaf">
                <span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0B5B3E"><path d="M12 2C8 6 4 10 4 15a8 8 0 0 0 16 0c0-5-4-9-8-13z"/></svg>
                </span>
              </div>
              
              <div className="gp-book-card max-w-[280px] sm:max-w-[320px] bg-gradient-to-br from-white/90 to-white/55 border border-white/90 p-2.5 rounded-[22px] shadow-[0_30px_60px_rgba(15,59,36,0.18)]">
                {/* Spinning Gold Badge */}
                <div className="absolute top-[-18px] right-[-18px] bg-gradient-to-r from-[#B38728] to-[#BF953F] text-[#2c1d00] font-playfair font-black text-[13px] rounded-full w-16 h-16 flex items-center justify-center text-center line-height-[1.1] shadow-[0_10px_22px_rgba(179,135,40,0.4)] gp-badge z-10">
                  2027<br />ED.
                </div>
                
                <img
                  src="/coffeetable-book.jpg"
                  alt="Coffee Table Book mockup"
                  className="w-full h-auto object-cover rounded-2xl border border-white/10"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Coffee Table Book Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div 
            className="relative bg-dark-green border border-gold-metallic/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-pure-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsBookModalOpen(false)}
              className="absolute top-4 right-4 text-pure-white/60 hover:text-pure-white hover:scale-110 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-playfair text-2xl font-black mb-2 text-gold-metallic">
              Access Full Coffee Table Book
            </h3>
            <p className="text-pure-white/70 text-xs sm:text-sm mb-6 font-medium leading-relaxed">
              Please enter your details below to view the digital edition of the Top 50 Sustainable Leaders Book.
            </p>

            {bookError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold rounded-md">
                {bookError}
              </div>
            )}

            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-pure-white/50 font-bold mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={bookFormData.name}
                  onChange={(e) => setBookFormData({ ...bookFormData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 bg-black/40 border ${validationErrors.name ? 'border-red-500' : 'border-pure-white/10'} rounded-md text-sm text-pure-white placeholder-pure-white/30 focus:border-gold-metallic focus:outline-none transition-colors`}
                />
                {validationErrors.name && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-pure-white/50 font-bold mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={bookFormData.email}
                  onChange={(e) => setBookFormData({ ...bookFormData, email: e.target.value })}
                  className={`w-full px-4 py-2.5 bg-black/40 border ${validationErrors.email ? 'border-red-500' : 'border-pure-white/10'} rounded-md text-sm text-pure-white placeholder-pure-white/30 focus:border-gold-metallic focus:outline-none transition-colors`}
                />
                {validationErrors.email && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-pure-white/50 font-bold mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit number"
                  value={bookFormData.phone}
                  onChange={(e) => setBookFormData({ ...bookFormData, phone: e.target.value })}
                  className={`w-full px-4 py-2.5 bg-black/40 border ${validationErrors.phone ? 'border-red-500' : 'border-pure-white/10'} rounded-md text-sm text-pure-white placeholder-pure-white/30 focus:border-gold-metallic focus:outline-none transition-colors`}
                />
                {validationErrors.phone && (
                  <p className="text-red-400 text-xs mt-1 font-medium">{validationErrors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={bookSubmitting}
                className="btn-shimmer w-full py-4 bg-gold-metallic text-dark-green font-black uppercase tracking-[0.2em] text-xs hover:shadow-gold-lux hover:-translate-y-0.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {bookSubmitting ? 'Submitting...' : 'Submit & View Book →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 10: TAKE ACTION / JOIN MOVEMENT */}
      <section className="py-24 bg-pure-white relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#B38728] font-black uppercase tracking-[0.3em] text-xs mb-3 block">
            Become a Catalyst
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl text-dark-green font-black mb-6">
            Join the Green Movement
          </h2>
          <p className="text-medium-grey text-sm sm:text-base leading-relaxed mb-10 max-w-xl mx-auto font-semibold">
            Whether you are a startup, MSME, sponsor, or student volunteer, there is a path for you to accelerate India's Viksit Bharat transition.
          </p>

          <form onSubmit={handleJoinSubmit} className="bg-pure-white p-8 sm:p-10 rounded-3xl border border-[#B38728]/25 shadow-sm text-left max-w-2xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label htmlFor="join-name" className="block text-xs font-bold text-dark-green uppercase tracking-wider mb-2">Your Name</label>
                <input id="join-name" type="text" required className="w-full bg-[#FCFBF9] border border-light-grey rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B38728] font-semibold text-gray-700" placeholder="e.g. Aarav Sharma" />
              </div>
              <div>
                <label htmlFor="join-email" className="block text-xs font-bold text-dark-green uppercase tracking-wider mb-2">Email Address</label>
                <input id="join-email" type="email" required className="w-full bg-[#FCFBF9] border border-light-grey rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B38728] font-semibold text-gray-700" placeholder="e.g. aarav@gmail.com" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-dark-green uppercase tracking-wider mb-2">Select Your Role</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: 'entrepreneur', label: 'Startup/MSME' },
                  { value: 'partner', label: 'ESG Partner' },
                  { value: 'sponsor', label: 'Sponsor' },
                  { value: 'volunteer', label: 'Volunteer' }
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setJoinRole(role.value)}
                    className={`py-2.5 px-3 text-center border text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                      joinRole === role.value
                        ? 'border-[#B38728] bg-gold-metallic text-dark-green shadow-sm'
                        : 'border-light-grey bg-pure-white text-gray-500 hover:border-[#B38728]/40'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gold-metallic text-dark-green font-black uppercase tracking-[0.2em] text-xs hover:shadow-gold-lux hover:scale-102 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Submit Application
              <Check className="w-4.5 h-4.5" />
            </button>

            {joinStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 text-green-700 rounded-lg text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Thank you! Your join request has been sent successfully to the secretariat.</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* SECTION 11: RESOURCES & TOOLKITS */}
      <section className="py-24 bg-cream-white relative z-10 border-t border-light-grey">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#B38728] font-black uppercase tracking-[0.3em] text-xs mb-3 block">
              Knowledge Hub
            </span>
            <h2 className="font-playfair text-4xl sm:text-5xl text-dark-green font-black">
              Resources & Toolkits
            </h2>
            <p className="text-medium-grey text-sm mt-3 font-semibold font-inter">
              Accelerate your sustainable planning with our curated guides and template toolkits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'Green MSME Compliance Guide', format: 'PDF (4.2 MB)', desc: 'Understand environmental regulations and how to register green certifications for MSMEs in India.', date: 'May 2027' },
              { title: 'SDG Pitch Deck Template', format: 'PPTX (1.8 MB)', desc: 'Pitch template structured to highlight carbon footprint reductions and ESG metrics for investors.', date: 'Jun 2027' },
              { title: 'Carbon Footprint Calculator', format: 'EXCEL (2.1 MB)', desc: 'Simplified spreadsheet calculator mapping local business logistics and waste into carbon output metrics.', date: 'Apr 2027' }
            ].map((res, i) => (
              <div key={i} className="bg-pure-white p-8 border border-light-grey/80 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#B38728]/10 flex items-center justify-center text-[#B38728] mb-5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-playfair text-xl font-black text-dark-green mb-2">{res.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold mb-6">{res.desc}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-light-grey mt-auto">
                  <span className="text-[10px] text-medium-grey font-bold uppercase tracking-wider">{res.format}</span>
                  <button className="flex items-center gap-1.5 text-xs font-black text-[#B38728] hover:text-dark-green transition-colors cursor-pointer">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12: SPONSORS & PARTNERS */}
      <section className="py-24 bg-pure-white text-center border-t border-light-grey relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-[#B38728] font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">
            Collaborators
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl text-dark-green font-black mb-8">
            Supported by Trusted Institutions
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-12 max-w-4xl mx-auto py-8">
            <div className="bg-pure-white px-8 py-5 border border-light-grey rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="font-playfair text-xl font-bold tracking-tight text-indian-green">
                MEIF
              </span>
              <span className="text-[8px] block uppercase text-medium-grey tracking-widest font-bold mt-1">
                NGO Organizer
              </span>
            </div>
            <div className="bg-pure-white px-8 py-5 border border-light-grey rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="font-inter text-xl font-black tracking-tight text-[#0A2540]">
                VyapaarJagat.com
              </span>
              <span className="text-[8px] block uppercase text-medium-grey tracking-widest font-bold mt-1">
                Media Power
              </span>
            </div>
            <div className="bg-pure-white px-8 py-5 border border-light-grey rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="font-playfair text-xl font-extrabold tracking-tight text-[#B38728]">
                CEED
              </span>
              <span className="text-[8px] block uppercase text-medium-grey tracking-widest font-bold mt-1">
                Association Partner
              </span>
            </div>
            <div className="bg-pure-white px-8 py-5 border border-light-grey rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="font-playfair text-xl font-bold tracking-tight text-dark-green">
                Peers Global
              </span>
              <span className="text-[8px] block uppercase text-medium-grey tracking-widest font-bold mt-1">
                Business Platform
              </span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs text-medium-grey mb-4 font-semibold font-inter">
              Sponsorship slots are limited. Highlight your brand's commitment to ESG.
            </p>
            <Link
              to="/sponsors/opportunities"
              className="text-xs font-black text-[#B38728] hover:text-dark-green uppercase tracking-widest border-b-2 border-[#B38728] hover:border-dark-green pb-1 transition-colors duration-200"
            >
              View Sponsorship Packages →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 13: FINAL CTA STRIP */}
      <section className="py-16 bg-gradient-to-r from-[#02110B] to-[#0A5C36] text-pure-white text-center relative z-10 shadow-lg border-y border-[#B38728]/20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-playfair text-3xl sm:text-4xl font-black mb-4 text-gold-metallic drop-shadow-sm">
            Nominations close soon. Apply today — it's FREE.
          </h2>
          <p className="text-pure-white/90 text-sm mb-8 max-w-xl mx-auto font-semibold font-inter">
            Secure your recognition in front of India's premier sustainable business network. Let green innovation drive Viksit Bharat.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/awards/apply"
              className="px-8 py-3 bg-gold-metallic text-dark-green text-xs uppercase tracking-widest font-black hover:shadow-gold-lux transition-all rounded-md"
            >
              Apply for Award
            </Link>
            <Link
              to="/event-2027"
              className="px-8 py-3 border border-[#B38728] text-[#B38728] text-xs uppercase tracking-widest font-black hover:bg-gold-metallic hover:text-dark-green hover:border-transparent transition-all rounded-md"
            >
              Get Event Pass
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
