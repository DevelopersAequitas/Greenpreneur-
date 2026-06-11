import { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: number;
  authorName: string;
  profilePhotoUrl: string;
  rating: number;
  relativeTimeDescription: string;
  text: string;
}

interface ReviewData {
  aggregate: {
    rating: number;
    totalReviews: number;
    label: string;
  };
  reviews: Review[];
}

export default function GoogleReviews() {
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch from backend, but fallback to demo data if backend isn't running
    fetch('http://localhost:3000/api/google-reviews')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend not running, using demo fallback data:", err);
        // Fallback demo data so user can see it immediately
        setData({
          aggregate: { rating: 5.0, totalReviews: 169, label: "EXCELLENT" },
          reviews: [
            {
              id: 1, authorName: "Alpa's recipe", profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjX1aW",
              rating: 5, relativeTimeDescription: "4 March 2023",
              text: "Thank u for this wonderful opportunity...to share my journey as a Mompreneur...It was our pleasure..."
            },
            {
              id: 2, authorName: "Surabhi Joshi", profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjW",
              rating: 5, relativeTimeDescription: "18 February 2023",
              text: "Thank you for giving opportunity to share view on such a large platform."
            },
            {
              id: 3, authorName: "Dr. Kavita Saxena", profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjY",
              rating: 5, relativeTimeDescription: "12 February 2023",
              text: "Fempreneur talk show is a great initiative by Vyapaar Jagat and am sure such initiatives will contribute immensely in helping n supporting..."
            },
            {
              id: 4, authorName: "Jyotsna Joshi", profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjZ",
              rating: 5, relativeTimeDescription: "12 February 2023",
              text: "It's a really nice experience"
            }
          ]
        });
        setLoading(false);
      });
  }, []);

  const slideLeft = () => {
    const slider = document.getElementById('review-slider');
    if (slider) slider.scrollLeft -= slider.offsetWidth;
  };

  const slideRight = () => {
    const slider = document.getElementById('review-slider');
    if (slider) slider.scrollLeft += slider.offsetWidth;
  };

  if (loading) {
    return (
      <div className="flex justify-center my-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indian-green"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto mt-20 relative px-4 font-inter">
      {/* Header Area */}
      <div className="text-center mb-8 flex flex-col items-center">
        <h3 className="text-xl font-bold uppercase tracking-wider text-[#1a1a1a]">
          {data.aggregate.label}
        </h3>
        
        {/* Aggregate Stars */}
        <div className="flex justify-center gap-1 my-2">
          {[...Array(Math.round(data.aggregate.rating))].map((_, i) => (
            <Star key={i} className="w-8 h-8 fill-[#FFB900] text-[#FFB900]" />
          ))}
        </div>
        
        <p className="text-sm text-gray-800 font-medium mb-3">
          Based on <strong>{data.aggregate.totalReviews} reviews</strong>
        </p>
        
        {/* Google Logo */}
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
          alt="Google" 
          className="h-8 object-contain"
        />
      </div>

      {/* Reviews Slider Area */}
      <div className="relative group">
        {/* Left Arrow */}
        <button 
          onClick={slideLeft}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md text-gray-500 hover:text-gray-800 hover:shadow-lg transition-all md:hidden group-hover:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Cards Container */}
        <div 
          id="review-slider"
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar py-4 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {data.reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-6 flex-shrink-0 w-[280px] sm:w-[320px] snap-center hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300 flex flex-col"
            >
              {/* Reviewer Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={review.profilePhotoUrl} 
                    alt={review.authorName} 
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.authorName)}&background=random`;
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 leading-tight">
                      {review.authorName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {review.relativeTimeDescription}
                    </span>
                  </div>
                </div>
                {/* Small Google Icon on Card */}
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                  alt="Google" 
                  className="w-5 h-5"
                />
              </div>

              {/* Review Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FFB900] text-[#FFB900]" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm text-gray-700 leading-relaxed flex-grow">
                {review.text.length > 150 ? review.text.substring(0, 150) + '...' : review.text}
              </p>
              
              {review.text.length > 150 && (
                <button className="text-left text-xs font-semibold text-gray-500 mt-2 hover:text-gray-800 transition-colors">
                  Read more
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={slideRight}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md text-gray-500 hover:text-gray-800 hover:shadow-lg transition-all md:hidden group-hover:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
