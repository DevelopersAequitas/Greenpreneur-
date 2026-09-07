import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import popupImage from '../assets/app-popup.jpg';

export default function AppPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Small delay to allow the page to render first before showing popup
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full transform transition-all flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-3 right-3 z-10 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Popup Image */}
        <div className="w-full relative">
          <img 
            src={popupImage} 
            alt="Greenpreneur Mobile App" 
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Action Buttons Area */}
        <div className="bg-[#EBF6EE] p-6 sm:p-8 flex flex-col items-center justify-center border-t border-primary-green/20">
          <h3 className="font-playfair text-xl font-bold text-dark-green mb-4 text-center">
            Download the Greenpreneur App
          </h3>
          <div className="flex flex-row flex-wrap justify-center gap-4">
            <a 
              href="https://apps.apple.com/in/app/greenpreneur-unity/id6782311572"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105 inline-block"
              onClick={closePopup}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-12 w-auto" />
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.unity.greenpreneur"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105 inline-block"
              onClick={closePopup}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-12 w-auto" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
