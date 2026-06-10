import { Lock } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-cream-white min-h-screen font-inter">
      {/* Header Hero */}
      <header className="relative bg-dark-green py-16 px-6 overflow-hidden text-center border-b border-accent-gold/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,107,60,0.4),transparent)]"></div>
          <div className="absolute inset-0 heritage-ornament opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent-gold/25 text-accent-gold border border-accent-gold/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Data Safety
          </div>
          <h1 className="text-pure-white text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-pure-white/70 text-sm sm:text-base font-light max-w-xl mx-auto">
            Learn more about how we collect, protect, and use the information you provide.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-6 max-w-4xl mx-auto">
        <div className="bg-pure-white p-8 sm:p-12 rounded-xl border border-light-grey shadow-sm text-gray-700 leading-relaxed font-light space-y-8">
          
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-medium-grey font-bold uppercase tracking-wider">Last Updated: June 2026</p>
              <h2 className="text-xl font-bold text-dark-green font-playfair">Privacy & Cookie Policy</h2>
            </div>
          </div>

          {/* Intro */}
          <p className="text-sm">
            Greenpreneur (owned and operated by Aequitas Information Technology Pvt Ltd) values your privacy. This policy describes how we collect, use, store, and process your personal details when you interact with our website <a href="https://greenpreneur.in" className="text-primary hover:underline font-semibold">greenpreneur.in</a>.
          </p>

          {/* 1. Collection */}
          <section className="space-y-3">
            <h3 className="text-base font-bold text-dark-green uppercase tracking-wider">1. Information We Collect</h3>
            <p className="text-sm">
              We collect information that you actively provide to us during various interactions:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>
                <strong>Membership & Forms:</strong> Name, Email, Phone, Company, Designation, Sector, City, Website Link, and custom questionnaire answers.
              </li>
              <li>
                <strong>Images & Media:</strong> Uploaded profile pictures, promoter images, or organization logos.
              </li>
              <li>
                <strong>Transaction details:</strong> Payment references (e.g. Razorpay payment ID), subscription levels, and billing indicators (we do **not** store card numbers or banking passwords directly on our servers).
              </li>
            </ul>
          </section>

          {/* 2. Usage */}
          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h3 className="text-base font-bold text-dark-green uppercase tracking-wider">2. How We Use Your Information</h3>
            <p className="text-sm">
              The information we collect is utilized to deliver high-quality, professional services:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>To evaluate and process award nominations and community membership applications.</li>
              <li>To trigger Zoho SMTP confirmation and notification emails regarding your submissions.</li>
              <li>To set up public voting and winner showcase pages (only promotional details like nominee names, company, and category are shared publicly).</li>
              <li>To communicate agenda updates, event passes, or coordinate logistics for the offline conclave.</li>
              <li>To listing businesses in our directories to help build authority and exposure.</li>
            </ul>
          </section>

          {/* 3. Security */}
          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h3 className="text-base font-bold text-dark-green uppercase tracking-wider">3. Protection of Data</h3>
            <p className="text-sm">
              We employ robust administrative, technical, and physical security measures to protect your personal information. Database access is strictly restricted to authorized administrators, and data transmitted through the site is encrypted using secure TLS/SSL protocols. 
            </p>
          </section>

          {/* 4. Third Parties */}
          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h3 className="text-base font-bold text-dark-green uppercase tracking-wider">4. Sharing with Third Parties</h3>
            <p className="text-sm">
              We do not sell or lease your personal data. We only share information with trusted third-party providers necessary to complete business operations:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li><strong>Razorpay:</strong> Secure payment processing gateways.</li>
              <li><strong>Zoho Mail:</strong> Relaying confirmation and notification emails.</li>
              <li><strong>VyapaarJagat.com:</strong> Media coverage and directory listing integrations.</li>
            </ul>
          </section>

          {/* 5. Cookies */}
          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h3 className="text-base font-bold text-dark-green uppercase tracking-wider">5. Cookies & Tracking</h3>
            <p className="text-sm">
              We use cookie technologies to store your preferences, keep you logged into the admin dashboard, and analyze website traffic. You can adjust your browser settings to refuse cookies, though some features of the website may not function correctly as a result.
            </p>
          </section>

          {/* 6. Under 18 */}
          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h3 className="text-base font-bold text-dark-green uppercase tracking-wider">6. Parental Consent</h3>
            <p className="text-sm">
              If you are under the age of 18, or reside in the European Union, verifiable parental consent is required before you create a membership account or submit applications on this platform.
            </p>
          </section>

          <p className="text-xs text-medium-grey border-t border-gray-100 pt-6">
            For data protection inquiries or to request deletion of your information from our database, please write to us at <a href="mailto:hello@greenpreneur.in" className="text-primary hover:underline font-semibold">hello@greenpreneur.in</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
