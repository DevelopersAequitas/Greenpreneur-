import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { getNominationCount } from '../utils/api';
// import AppPopup from './AppPopup';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isCommunityDropdownHovered, setIsCommunityDropdownHovered] = useState(false);
  const [isMoreDropdownHovered, setIsMoreDropdownHovered] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileCommunityOpen, setMobileCommunityOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [showAllInquiries, setShowAllInquiries] = useState(false);
  const [showAllQuickLinks, setShowAllQuickLinks] = useState(false);
  const location = useLocation();

  const [bannerVisible, setBannerVisible] = useState(() => {
    return localStorage.getItem('announcementDismissed') !== 'true';
  });

  const [nominationCount, setNominationCount] = useState(100);

  useEffect(() => {
    getNominationCount()
      .then((res: any) => {
        if (res.success && res.data) {
          setNominationCount(100 + res.data.count);
        }
      })
      .catch((err: any) => {
        console.error('Failed to fetch nomination count:', err);
      });
  }, []);

  const dismissBanner = () => {
    localStorage.setItem('announcementDismissed', 'true');
    setBannerVisible(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsOpen(false);
    setMobileDropdownOpen(false);
    setMobileCommunityOpen(false);
    setMobileMoreOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const isEventAwardsActive = 
    location.pathname === '/event-2027' || 
    location.pathname.startsWith('/awards') ||
    location.pathname.startsWith('/sponsors') ||
    location.pathname === '/coffee-table-book';

  const isCommunityActive =
    location.pathname === '/community' ||
    location.pathname === '/voice-of-greenpreneur';

  const isMoreActive =
    location.pathname === '/jury' ||
    location.pathname === '/partners' ||
    location.pathname.startsWith('/blogs');

  return (
    <div className="min-h-screen flex flex-col bg-cream-white font-inter">
      {/* Fix 5: Announcement Banner */}
      {bannerVisible && (
        <div className="fixed top-0 left-0 w-full h-10 bg-gradient-to-r from-saffron via-ashoka-navy to-indian-green text-pure-white z-50 flex items-center justify-between px-6 text-xs sm:text-[13px] font-medium font-inter">
          <div className="flex-grow text-left font-bold tracking-wide flex items-center overflow-hidden">
            <span className="truncate">🇮🇳 Supporting Viksit Bharat @2047 | Greenpreneur 2027 — 25th June, Ahmedabad | </span>
            <Link to="/awards/apply" className="underline text-yellow-300 hover:text-yellow-400 font-extrabold ml-1 shrink-0">
              Nominations Open — Apply FREE →
            </Link>
          </div>

          <div className="flex items-center gap-4 shrink-0 ml-4">
            <div className="hidden lg:flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-yellow-400/40 shadow-[0_0_12px_rgba(250,204,21,0.3)] backdrop-blur-sm relative overflow-hidden group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              <div className="w-2 h-2 rounded-full bg-[#5DCAA5] animate-pulse shadow-[0_0_8px_rgba(93,202,165,0.8)]"></div>
              <span className="text-yellow-300 font-bold tracking-widest text-[11px] uppercase drop-shadow-md flex items-center gap-1">
                Total Nominations: <span className="text-white text-[13px] inline-block min-w-[28px] text-center font-black transition-all duration-300">{nominationCount}</span>
              </span>
            </div>

            <button
              onClick={dismissBanner}
              className="text-pure-white/70 hover:text-pure-white hover:scale-110 transition-all cursor-pointer"
              aria-label="Dismiss Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Fix 1: Sticky Navigation Header */}
      <nav
        style={{ height: '72px' }}
        className={`fixed left-0 w-full z-[1000] bg-pure-white flex items-center justify-between px-4 lg:px-10 transition-all duration-300 ${
          bannerVisible ? 'top-10' : 'top-0'
        } ${scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]' : ''}`}
      >
        {/* Dynamic metallic gold ribbon divider below navigation */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gold-metallic"></div>

        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" style={{ textDecoration: 'none', cursor: 'pointer', gap: '10px' }}>
          <img src="/logo-cropped.png" alt="Greenpreneur" className="h-[45px] lg:h-[50px] w-auto object-contain drop-shadow-sm" />
        </Link>

        {/* Desktop Center Nav Links (reduced gap to prevent overflow) */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5 mx-auto">
          <NavLink to="/" className={({ isActive }) => `font-inter text-[13px] font-semibold uppercase tracking-[0.8px] whitespace-nowrap py-1 border-b-2 transition-all duration-200 ${isActive ? 'text-indian-green border-indian-green' : 'text-[#1A1A1A] border-transparent hover:text-[#B38728] hover:border-[#B38728]'}`}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `font-inter text-[13px] font-semibold uppercase tracking-[0.8px] whitespace-nowrap py-1 border-b-2 transition-all duration-200 ${isActive ? 'text-indian-green border-indian-green' : 'text-[#1A1A1A] border-transparent hover:text-[#B38728] hover:border-[#B38728]'}`}>
            About
          </NavLink>

          {/* Event & Awards Hover Dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => setIsDropdownHovered(true)}
            onMouseLeave={() => setIsDropdownHovered(false)}
          >
            <button
              className={`font-inter text-[13px] font-semibold uppercase tracking-[0.8px] whitespace-nowrap py-1 border-b-2 transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                isEventAwardsActive
                  ? 'text-indian-green border-indian-green font-semibold'
                  : 'text-[#1A1A1A] border-transparent hover:text-[#B38728] hover:border-[#B38728]'
              }`}
            >
              Event & Awards <span className="text-[12px] text-[#B38728]">▾</span>
            </button>

            <div
              className={`absolute left-0 mt-2 w-[220px] bg-pure-white border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.12)] rounded-lg transition-all duration-200 origin-top-left z-[999] ${
                isDropdownHovered
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-2 flex flex-col">
                <Link
                  to="/event-2027"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150"
                >
                  Event Overview
                </Link>
                <a
                  href="/event-2027#agenda"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150"
                >
                  Event Agenda
                </a>
                <Link
                  to="/awards/categories"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150"
                >
                  Award Categories
                </Link>
                <Link
                  to="/awards/overview"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150"
                >
                  How to Nominate
                </Link>
                <a
                  href="/awards/overview#jury"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150"
                >
                  Speakers & Jury Panel 2027
                </a>
                <a
                  href="/awards/overview#why-attend"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150"
                >
                  Why Attend
                </a>
                <Link
                  to="/sponsors/opportunities"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150 font-semibold"
                >
                  Sponsors
                </Link>
                <Link
                  to="/coffee-table-book"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150 font-semibold"
                >
                  The Book
                </Link>
              </div>
            </div>
          </div>

          <NavLink to="/winners" className={({ isActive }) => `font-inter text-[13px] font-semibold uppercase tracking-[0.8px] whitespace-nowrap py-1 border-b-2 transition-all duration-200 ${isActive ? 'text-indian-green border-indian-green' : 'text-[#1A1A1A] border-transparent hover:text-[#B38728] hover:border-[#B38728]'}`}>
            Winners
          </NavLink>

          {/* Community Hover Dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => setIsCommunityDropdownHovered(true)}
            onMouseLeave={() => setIsCommunityDropdownHovered(false)}
          >
            <button
              className={`font-inter text-[13px] font-semibold uppercase tracking-[0.8px] whitespace-nowrap py-1 border-b-2 transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                isCommunityActive
                  ? 'text-indian-green border-indian-green font-semibold'
                  : 'text-[#1A1A1A] border-transparent hover:text-[#B38728] hover:border-[#B38728]'
              }`}
            >
              Community <span className="text-[12px] text-[#B38728]">▾</span>
            </button>

            <div
              className={`absolute left-0 mt-2 w-[220px] bg-pure-white border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.12)] rounded-lg transition-all duration-200 origin-top-left z-[999] ${
                isCommunityDropdownHovered
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-2 flex flex-col">
                <Link
                  to="/community"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150 font-semibold"
                >
                  Community Hub
                </Link>
                <Link
                  to="/voice-of-greenpreneur"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150 font-semibold"
                >
                  Voice of Greenpreneur
                </Link>
              </div>
            </div>
          </div>

          {/* More Hover Dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => setIsMoreDropdownHovered(true)}
            onMouseLeave={() => setIsMoreDropdownHovered(false)}
          >
            <button
              className={`font-inter text-[13px] font-semibold uppercase tracking-[0.8px] whitespace-nowrap py-1 border-b-2 transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                isMoreActive
                  ? 'text-indian-green border-indian-green font-semibold'
                  : 'text-[#1A1A1A] border-transparent hover:text-[#B38728] hover:border-[#B38728]'
              }`}
            >
              More <span className="text-[12px] text-[#B38728]">▾</span>
            </button>

            <div
              className={`absolute left-0 mt-2 w-[220px] bg-pure-white border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.12)] rounded-lg transition-all duration-200 origin-top-left z-[999] ${
                isMoreDropdownHovered
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <div className="py-2 flex flex-col">
                <Link
                  to="/jury"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150 font-semibold"
                >
                  Speakers & Jury
                </Link>
                <Link
                  to="/partners"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150 font-semibold"
                >
                  Partners
                </Link>
                <Link
                  to="/blogs"
                  className="px-5 py-3 text-sm font-inter text-[#1A1A1A] block hover:bg-[#F0F7F4] hover:text-[#B38728] hover:pl-6 transition-all duration-150 font-semibold"
                >
                  Blogs
                </Link>
              </div>
            </div>
          </div>
          <NavLink to="/faqs" className={({ isActive }) => `font-inter text-[13px] font-semibold uppercase tracking-[0.8px] whitespace-nowrap py-1 border-b-2 transition-all duration-200 ${isActive ? 'text-indian-green border-indian-green' : 'text-[#1A1A1A] border-transparent hover:text-[#B38728] hover:border-[#B38728]'}`}>
            FAQs
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `font-inter text-[13px] font-semibold uppercase tracking-[0.8px] whitespace-nowrap py-1 border-b-2 transition-all duration-200 ${isActive ? 'text-indian-green border-indian-green' : 'text-[#1A1A1A] border-transparent hover:text-[#B38728] hover:border-[#B38728]'}`}>
            Contact
          </NavLink>
        </div>

        {/* Desktop Right Nav Buttons */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            to="/event-2027"
            className="h-[40px] px-5 flex items-center justify-center text-[13px] font-bold font-inter uppercase rounded-[6px] border border-[#B38728] text-[#B38728] hover:bg-gold-metallic hover:text-dark-green hover:border-transparent whitespace-nowrap transition-all duration-200"
          >
            GET PASS
          </Link>
          <Link
            to="/awards/apply"
            className="h-[40px] px-[24px] flex items-center justify-center text-[13px] font-black font-inter uppercase bg-gold-metallic text-dark-green hover:shadow-gold-lux hover:scale-102 rounded-[6px] whitespace-nowrap transition-all duration-200"
          >
            NOMINATE
          </Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-primary-green hover:scale-105 transition-all focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Fix 6: Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-screen w-screen bg-[#0D3D20] text-pure-white shadow-2xl flex flex-col p-6 transition-transform duration-300 overflow-y-auto ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header in mobile drawer */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-pure-white/10">
            <Link to="/" className="flex items-center" style={{ textDecoration: 'none', gap: '10px' }} onClick={() => setIsOpen(false)}>
              {/* Mobile Drawer Logo */}
              <img src="/logo-cropped.png" alt="Greenpreneur" className="h-[40px] w-auto object-contain drop-shadow-sm" />
            </Link>
            <button onClick={() => setIsOpen(false)} className="text-pure-white hover:scale-110 transition-all cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links list */}
          <div className="flex flex-col text-left font-inter text-[18px]">
            <NavLink to="/" onClick={() => setIsOpen(false)} className="py-4 border-b border-pure-white/10 text-pure-white hover:text-accent-gold transition-colors font-bold uppercase">
              HOME
            </NavLink>
            <NavLink to="/about" onClick={() => setIsOpen(false)} className="py-4 border-b border-pure-white/10 text-pure-white hover:text-accent-gold transition-colors font-bold uppercase">
              ABOUT
            </NavLink>

            {/* Expandable EVENT & AWARDS */}
            <div className="flex flex-col border-b border-pure-white/10">
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="w-full flex items-center justify-between py-4 hover:text-accent-gold transition-colors text-left font-bold text-pure-white text-[18px] uppercase"
              >
                <span>EVENT & AWARDS</span>
                <span className={`text-xs transform transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-185' : ''}`}>▼</span>
              </button>

              <div className={`pl-4 flex flex-col gap-3 overflow-hidden transition-all duration-300 ${mobileDropdownOpen ? 'max-h-[350px] py-2' : 'max-h-0'}`}>
                <Link to="/event-2027" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white">
                  → Event Overview
                </Link>
                <a href="/event-2027#agenda" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white">
                  → Event Agenda
                </a>
                <Link to="/awards/categories" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white">
                  → Award Categories
                </Link>
                <Link to="/awards/overview" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white">
                  → How to Nominate
                </Link>
                <a href="/awards/overview#jury" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white">
                  → Speakers & Jury Panel 2027
                </a>
                <a href="/awards/overview#why-attend" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white">
                  → Why Attend
                </a>
                <Link to="/sponsors/opportunities" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white font-bold">
                  → Sponsors
                </Link>
                <Link to="/coffee-table-book" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white font-bold">
                  → The Book
                </Link>
              </div>
            </div>

            <NavLink to="/winners" onClick={() => setIsOpen(false)} className="py-4 border-b border-pure-white/10 text-pure-white hover:text-accent-gold transition-colors font-bold uppercase">
              WINNERS
            </NavLink>

            {/* Expandable COMMUNITY Drawer */}
            <div className="flex flex-col border-b border-pure-white/10">
              <button
                onClick={() => setMobileCommunityOpen(!mobileCommunityOpen)}
                className="w-full flex items-center justify-between py-4 hover:text-accent-gold transition-colors text-left font-bold text-pure-white text-[18px] uppercase cursor-pointer"
              >
                <span>COMMUNITY</span>
                <span className={`text-xs transform transition-transform duration-200 ${mobileCommunityOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              <div className={`pl-4 flex flex-col gap-3 overflow-hidden transition-all duration-300 ${mobileCommunityOpen ? 'max-h-[150px] py-2' : 'max-h-0'}`}>
                <Link to="/community" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white font-bold">
                  → Community Hub
                </Link>
                <Link to="/voice-of-greenpreneur" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white font-bold">
                  → Voice of Greenpreneur
                </Link>
              </div>
            </div>

            {/* Expandable MORE Drawer */}
            <div className="flex flex-col border-b border-pure-white/10">
              <button
                onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                className="w-full flex items-center justify-between py-4 hover:text-accent-gold transition-colors text-left font-bold text-pure-white text-[18px] uppercase cursor-pointer"
              >
                <span>MORE</span>
                <span className={`text-xs transform transition-transform duration-200 ${mobileMoreOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              <div className={`pl-4 flex flex-col gap-3 overflow-hidden transition-all duration-300 ${mobileMoreOpen ? 'max-h-[200px] py-2' : 'max-h-0'}`}>
                <Link to="/jury" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white font-bold">
                  → Speakers & Jury
                </Link>
                <Link to="/partners" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white font-bold">
                  → Partners
                </Link>
                <Link to="/blogs" onClick={() => setIsOpen(false)} className="py-1 text-sm font-semibold text-pure-white/80 hover:text-pure-white font-bold">
                  → Blogs
                </Link>
              </div>
            </div>
            <NavLink to="/faqs" onClick={() => setIsOpen(false)} className="py-4 border-b border-pure-white/10 text-pure-white hover:text-accent-gold transition-colors font-bold uppercase">
              FAQS
            </NavLink>
            <NavLink to="/contact" onClick={() => setIsOpen(false)} className="py-4 border-b border-pure-white/10 text-pure-white hover:text-accent-gold transition-colors font-bold uppercase">
              CONTACT
            </NavLink>
          </div>

          {/* CTA Buttons in mobile menu */}
          <div className="flex flex-col gap-4 mt-8">
            <Link
              to="/awards/apply"
              onClick={() => setIsOpen(false)}
              className="w-full h-[56px] flex items-center justify-center bg-gold-metallic text-dark-green font-black uppercase tracking-wider text-sm rounded-[6px] shadow-gold-lux"
            >
              🌿 NOMINATE — FREE
            </Link>
            <Link
              to="/event-2027"
              onClick={() => setIsOpen(false)}
              className="w-full h-[56px] flex items-center justify-center border border-[#B38728] bg-transparent text-[#B38728] font-bold uppercase tracking-wider text-sm rounded-[6px] hover:bg-gold-metallic hover:text-dark-green transition-all"
            >
              GET EVENT PASS
            </Link>
          </div>

          {/* Bottom metadata and social row */}
          <div className="mt-auto pt-6 border-t border-pure-white/10 flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-xs text-pure-white/70">
              <a href="tel:+917041151714" className="flex items-center gap-2 hover:text-pure-white transition-colors">
                <Phone className="w-4 h-4 text-accent-gold" /> +91 70411 51714
              </a>
              <a href="mailto:hello@greenpreneur.in" className="flex items-center gap-2 hover:text-pure-white transition-colors">
                <Mail className="w-4 h-4 text-accent-gold" /> hello@greenpreneur.in
              </a>
            </div>

            {/* Social Icons row */}
            <div className="flex gap-4">
              <a href="https://instagram.com/greenpreneur.in" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-pure-white/10 flex items-center justify-center hover:bg-accent-gold transition-all" aria-label="Instagram">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="https://facebook.com/share/1GvbURQ1Fi" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-pure-white/10 flex items-center justify-center hover:bg-accent-gold transition-all" aria-label="Facebook">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://linkedin.com/company/greenpreneur" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-pure-white/10 flex items-center justify-center hover:bg-accent-gold transition-all" aria-label="LinkedIn">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content Body */}
      <main className={`flex-grow ${bannerVisible ? 'pt-[112px]' : 'pt-[72px]'} pb-16 lg:pb-0 transition-all duration-300`}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark-green text-pure-white py-16 mt-auto relative z-10 border-t-[5px]" style={{ borderImage: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C) 1' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Col 1: Brand details */}
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '260px' }}>
              {/* Footer Logo */}
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '12px' }}>
                <img src="/logo-cropped.png" alt="Greenpreneur" className="h-[60px] md:h-[70px] w-auto object-contain drop-shadow-sm" />
              </Link>
              {/* Footer tagline */}
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Entrepreneurs Redefining Sustainability for Viksit Bharat
              </p>
              {/* Social Icons */}
              <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                <a
                  href="https://instagram.com/greenpreneur.in"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-icon"
                  aria-label="Instagram"
                  style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com/share/1GvbURQ1Fi"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/greenpreneur"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@VyapaarJagatTV"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                  </svg>
                </a>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, margin: 0 }}>
                India's most comprehensive green entrepreneurship platform. An annual initiative by MEIF powered by VyapaarJagat.com.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h5 className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-xs mb-6 pb-2 border-b border-pure-white/10">
                Quick Links
              </h5>
              <ul className="space-y-3 text-pure-white/70 text-sm">
                <li>
                  <Link to="/" className="hover:text-pure-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-pure-white transition-colors">About Legacy</Link>
                </li>
                <li>
                  <Link to="/awards/overview" className="hover:text-pure-white transition-colors">Awards Overview</Link>
                </li>
                <li>
                  <Link to="/event-2027" className="hover:text-pure-white transition-colors">Event 2027 Agenda</Link>
                </li>
                <li>
                  <Link to="/sponsors/opportunities" className="hover:text-pure-white transition-colors">Sponsorships</Link>
                </li>
                <li>
                  <Link to="/winners" className="hover:text-pure-white transition-colors">Past Winners</Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-pure-white transition-colors">Community</Link>
                </li>
                <li>
                  <Link to="/voice-of-greenpreneur" className="hover:text-pure-white transition-colors">Voice of Greenpreneur</Link>
                </li>
                <li>
                  <Link to="/blogs" className="hover:text-pure-white transition-colors">Blogs</Link>
                </li>
                <li>
                  <Link to="/faqs" className="hover:text-pure-white transition-colors">FAQs</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-pure-white transition-colors">Contact Us</Link>
                </li>

                {showAllQuickLinks && (
                  <>
                    <li className="pt-2 border-t border-pure-white/10">
                      <Link to="/privacy-policy" className="hover:text-pure-white transition-colors">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/terms-conditions" className="hover:text-pure-white transition-colors">Terms &amp; Conditions</Link>
                    </li>
                    <li>
                      <Link to="/refund-cancellation" className="hover:text-pure-white transition-colors">Refund &amp; Cancellation</Link>
                    </li>
                  </>
                )}

                <li>
                  <button
                    onClick={() => setShowAllQuickLinks(!showAllQuickLinks)}
                    className="text-[#D4AF37] hover:text-pure-white transition-colors text-xs uppercase tracking-wider font-bold flex items-center gap-1 mt-2"
                  >
                    {showAllQuickLinks ? '- Show Less' : '+ Show More'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Participate */}
            <div>
              <h5 className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-xs mb-6 pb-2 border-b border-pure-white/10">
                Participate & Inquiries
              </h5>
              <ul className="space-y-3 text-pure-white/70 text-sm">
                <li>
                  <Link to="/awards/apply" className="hover:text-pure-white transition-colors">Apply for Award</Link>
                </li>
                <li>
                  <Link to="/inquiry/membership" className="hover:text-pure-white transition-colors">Membership Inquiry</Link>
                </li>
                <li>
                  <Link to="/inquiry/apply-magazine" className="hover:text-pure-white transition-colors">Apply for Magazine</Link>
                </li>
                <li>
                  <Link to="/inquiry/start-chapter" className="hover:text-pure-white transition-colors">Start A Chapter</Link>
                </li>
                <li>
                  <Link to="/inquiry/sponsor" className="hover:text-pure-white transition-colors">Become a Sponsor</Link>
                </li>

                {showAllInquiries && (
                  <>
                    <li>
                      <Link to="/event-2027" className="hover:text-pure-white transition-colors">Get Event Pass</Link>
                    </li>
                    <li>
                      <Link to="/inquiry/advertise-magazine" className="hover:text-pure-white transition-colors">Advertise in Magazine</Link>
                    </li>
                    <li>
                      <Link to="/inquiry/partner" className="hover:text-pure-white transition-colors">Apply as Partner</Link>
                    </li>
                    <li>
                      <Link to="/inquiry/advertise-us" className="hover:text-pure-white transition-colors">Advertise with Us</Link>
                    </li>
                    <li>
                      <Link to="/inquiry/collaborate" className="hover:text-pure-white transition-colors">Collaboration</Link>
                    </li>
                    <li>
                      <Link to="/inquiry/fundraise" className="hover:text-pure-white transition-colors">Join to Fundraise</Link>
                    </li>
                    <li>
                      <Link to="/inquiry/invest" className="hover:text-pure-white transition-colors">Join to Invest</Link>
                    </li>
                    <li>
                      <Link to="/inquiry/publish-story" className="hover:text-pure-white transition-colors">Publish Your Story</Link>
                    </li>
                    <li>
                      <Link to="/inquiry/speaker-application" className="hover:text-pure-white transition-colors">Speaker Applications</Link>
                    </li>
                    <li>
                      <Link to="/inquiry/talk-show-speaker" className="hover:text-pure-white transition-colors">Talk Show Speakers</Link>
                    </li>
                  </>
                )}

                <li>
                  <button 
                    onClick={() => setShowAllInquiries(!showAllInquiries)}
                    className="text-[#D4AF37] hover:text-pure-white transition-colors text-xs uppercase tracking-wider font-bold flex items-center gap-1 mt-2"
                  >
                    {showAllInquiries ? '- Show Less' : '+ Show More'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h5 className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-xs mb-6 pb-2 border-b border-pure-white/10">
                Secretariat
              </h5>
              <div className="space-y-4 text-sm text-pure-white/80">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-semibold">+91 70411 51714</span>
                    <span className="text-xs text-pure-white/50">Vishal Parmar (Director)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <a href="mailto:hello@greenpreneur.in" className="font-semibold hover:text-pure-white transition-colors">
                      hello@greenpreneur.in
                    </a>
                    <span className="text-xs text-pure-white/50">Official Inquiries</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-xs text-pure-white/70">
                    Shapath 1, 805, Sarkhej - Gandhinagar Hwy, Highway Park Society, Bodakdev, Ahmedabad, Gujarat 380015
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider and Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)', marginTop: '40px', paddingTop: '20px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', margin: 0, paddingBottom: '8px' }}>
              © 2027 Greenpreneur | 1 Million Entrepreneurs International Forum | Section 8 NGO | 80G &amp; 12A Certified | CSR No: CSR00106194 | PAN: AACCZ1279M
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', margin: 0 }}>
              Niti Aayog Darpan Certified | CEED Association Partner
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', margin: '8px 0 0 0' }}>
              Designed &amp; Developed by <span className="text-pure-white/60 font-semibold">Aequitas Infotech</span>
            </p>

            {/* Indian Flag stripe */}
            <div className="h-1.5 w-full rounded-full mt-6 opacity-90" style={{ background: 'linear-gradient(to right, #FF9933, #FFFFFF, #138808)' }}></div>
            {/* SDG color bar */}
            <div className="h-2 w-full rounded-full mt-2 opacity-80" style={{ background: 'linear-gradient(to right, #E5243B, #DDA63A, #4C9F38, #C5192D, #EF402C, #26BDE2, #FCC30B, #A21942, #FD6925, #DD1367, #FD9D24, #BF8B2E, #3F7E44, #0A97D9, #56C02B, #00689D, #19486A)' }}></div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom CTAs (Mobile-only) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-[45] bg-pure-white border-t border-light-grey grid grid-cols-2 p-2 gap-2 shadow-2xl">
        <Link
          to="/event-2027"
          className="h-[56px] flex items-center justify-center text-xs uppercase tracking-widest font-black border border-[#B38728] text-[#B38728] rounded-md hover:bg-gold-metallic hover:text-dark-green"
        >
          Get Pass
        </Link>
        <Link
          to="/awards/apply"
          className="h-[56px] flex items-center justify-center text-xs uppercase tracking-widest font-black bg-gold-metallic text-dark-green rounded-md shadow-md shadow-gold-lux"
        >
          Apply Now
        </Link>
      </div>

      {/* Fix 4: WhatsApp Floating Button */}
      <a
        href="https://wa.me/917041151714"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-[80px] right-6 md:bottom-6 md:right-6 z-50 bg-[#25D366] text-pure-white w-14 h-14 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        title="Chat with us"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-16 bg-pure-white text-dark-text text-xs font-semibold px-3 py-1.5 rounded-md shadow-md border border-light-grey opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Chat with us
        </span>
      </a>

      {/* <AppPopup /> */}
    </div>
  );
}
