import appMockup from '../assets/app-mockup.jpg';
import { CheckCircle } from 'lucide-react';

interface AppPromoProps {
  title?: string;
  subtitle?: string;
  description?: string;
  integrationFocus?: boolean;
}

export default function AppPromo({
  title = "Connect, Collaborate, Grow",
  subtitle = "Available Now",
  description = "Access the Greenpreneur Unity app to network with eco-conscious entrepreneurs, track your impact, and build your sustainable business anywhere, anytime.",
  integrationFocus = false
}: AppPromoProps) {
  return (
    <div className="w-full bg-gradient-to-br from-[#F3F9EE] via-[#EBF6EE] to-[#E3F2E4] py-16 px-6 sm:px-12 rounded-3xl border border-[#B38728]/15 max-w-7xl mx-auto my-12 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Decorative leaf background shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-accent-gold/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left: Content */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 bg-primary-green rounded-full"></span>
            <span className="text-xs font-bold text-medium-grey uppercase tracking-widest">{subtitle}</span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4.5xl text-dark-green font-black leading-tight">
            {title}
          </h2>

          <p className="text-gray-600 font-inter text-sm sm:text-base leading-relaxed">
            {description}
          </p>

          {/* Integration Features if specified */}
          {integrationFocus ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-green">Unified Web Sync</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Your profile and voting stats sync instantly between web and app.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-green">Instant Push Alerts</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Receive real-time notifications for new votes and event schedule updates.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-green">Eco-Circles Workspace</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Collaborate in private groups, share project updates, and sync documents.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-green">Green Community Feed</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Share achievements and connect with verified eco-conscious peers.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-green">Sustainable Skills</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Access specialized courses, webinars, and masterclasses by industry experts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-green">Peer Networking Directory</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Directly message and find eco-circles to scale your sustainable business.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-green">Eco-Circles Groups</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Join niche industry circles tailored for green entrepreneurs and innovators.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-dark-green">Green Impact Tracker</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Log and highlight your sustainable contributions, certificates, and achievements.</p>
                </div>
              </div>
            </div>
          )}

          {/* Download Buttons */}
          <div className="flex flex-row flex-wrap gap-4 pt-4">
            <a 
              href="https://apps.apple.com/in/app/greenpreneur-unity/id6782311572"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105 inline-block"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-10 sm:h-12 w-auto" />
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.unity.greenpreneur"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105 inline-block"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10 sm:h-12 w-auto" />
            </a>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div>
              <div className="text-2xl sm:text-3xl font-playfair font-black text-primary-green">500+</div>
              <div className="text-xs text-medium-grey font-medium mt-1">Active Eco-Entrepreneurs</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-playfair font-black text-primary-green">90%+</div>
              <div className="text-xs text-medium-grey font-medium mt-1">Monthly Active Engagement</div>
            </div>
          </div>
        </div>

        {/* Right: Real Phone Mockup Image */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(40,90,50,0.2)] border border-[#B38728]/15 hover:scale-[1.03] hover:shadow-[0_25px_60px_rgba(40,90,50,0.28)] transition-all duration-500 ease-out group select-none bg-pure-white">
            <img 
              src={appMockup} 
              alt="Greenpreneur Mobile App" 
              className="w-full h-full object-cover block"
            />
            {/* Glossy Overlay Shine Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-pure-white/10 to-pure-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
