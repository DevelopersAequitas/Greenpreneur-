import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import AwardsOverview from './pages/AwardsOverview';
import AwardCategories from './pages/AwardCategories';
import ApplyAward from './pages/ApplyAward';
import Event2026 from './pages/Event2026';
import Sponsorship from './pages/Sponsorship';
import CoffeeTableBook from './pages/CoffeeTableBook';
import Community from './pages/Community';
import Winners from './pages/Winners';
import Jury from './pages/Jury';
import Partners from './pages/Partners';
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';
import VoteNominee from './pages/VoteNominee';
import InquiryPage from './pages/InquiryPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundCancellation from './pages/RefundCancellation';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import VoiceOfGreenpreneur from './pages/VoiceOfGreenpreneur';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes (Without Layout Wrapper) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Public Routes with Layout Wrapper */}
        <Route path="/" element={<Layout />}>
          {/* Main Landing Page */}
          <Route index element={<Home />} />
          
          {/* About Legacy Page */}
          <Route path="about" element={<About />} />
          
          {/* Awards Routes */}
          <Route path="awards/overview" element={<AwardsOverview />} />
          <Route path="awards/categories" element={<AwardCategories />} />
          <Route path="awards/apply" element={<ApplyAward />} />
          
          {/* Event Agenda & Booking */}
          <Route path="event-2026" element={<Event2026 />} />
          
          {/* Sponsorship Tiers */}
          <Route path="sponsors/opportunities" element={<Sponsorship />} />
          
          {/* Coffee Table Book Features */}
          <Route path="coffee-table-book" element={<CoffeeTableBook />} />
          
          {/* Community & Story Drive */}
          <Route path="community" element={<Community />} />
          
          {/* Past Winners */}
          <Route path="winners" element={<Winners />} />
          <Route path="jury" element={<Jury />} />
          <Route path="partners" element={<Partners />} />
          
          {/* Frequently Asked Questions */}
          <Route path="faqs" element={<FAQs />} />
          
          {/* Secretariat Contact Details */}
          <Route path="contact" element={<Contact />} />

          {/* Legal Pages */}
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-conditions" element={<TermsConditions />} />
          <Route path="refund-cancellation" element={<RefundCancellation />} />

          {/* Blogs Routes */}
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/:slug" element={<BlogDetail />} />

          {/* Voice of Greenpreneur Video Gallery */}
          <Route path="voice-of-greenpreneur" element={<VoiceOfGreenpreneur />} />
          
          {/* Voting Page */}
          <Route path="vote/:slug" element={<VoteNominee />} />

          {/* Dynamic Inquiry Forms */}
          <Route path="inquiry/:type" element={<InquiryPage />} />

          {/* URL Redirects for legacy routes */}
          <Route path="nominations" element={<Navigate to="/awards/apply" replace />} />
          <Route path="nominations/*" element={<Navigate to="/awards/apply" replace />} />
          <Route path="membership" element={<Navigate to="/community" replace />} />
          <Route path="membership/*" element={<Navigate to="/community" replace />} />

          {/* Catch-all Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
