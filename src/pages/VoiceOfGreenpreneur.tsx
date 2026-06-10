import { useState, useEffect } from 'react';
import { Play, X, Loader2, Video, AlertCircle } from 'lucide-react';
import { BASE_URL } from '../utils/api';

interface VoiceVideo {
  id: number;
  youtube_id: string;
  title: string;
  sort_order: number;
  created_at: string;
}

export default function VoiceOfGreenpreneur() {
  const [videos, setVideos] = useState<VoiceVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch(`${BASE_URL}/voice-videos`);
        const result = await res.json();
        if (result.success && result.data) {
          setVideos(result.data);
        } else {
          setError('Failed to load videos.');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Connection failed. Please check your internet connection.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const handleVideoClick = (youtubeId: string) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) {
      window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
    } else {
      setSelectedVideoId(youtubeId);
    }
  };

  return (
    <div className="bg-cream-white min-h-screen font-inter pb-20">
      {/* Hero Header */}
      <header className="relative bg-dark-green py-20 px-6 overflow-hidden text-center border-b border-accent-gold/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,107,60,0.4),transparent)]"></div>
          <div className="absolute inset-0 heritage-ornament opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent-gold/25 text-accent-gold border border-accent-gold/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Video Gallery
          </div>
          <h1 className="text-pure-white text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-6">
            Voice of Greenpreneur
          </h1>
          <p className="text-pure-white/70 text-base sm:text-lg font-light max-w-2xl mx-auto">
            Watch insights, interviews, and stories from green business leaders, founders, and experts shaping a sustainable future.
          </p>
        </div>
      </header>

      {/* Grid Container */}
      <main className="py-16 px-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-primary-green animate-spin" />
            <p className="text-medium-grey text-sm font-medium">Loading gallery...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-red-650" />
            <h3 className="text-red-800 font-bold font-playfair">Unable to Load Videos</h3>
            <p className="text-gray-600 text-xs font-light">{error}</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-pure-white border border-light-grey rounded-2xl p-16 text-center max-w-md mx-auto shadow-sm">
            <Video className="w-12 h-12 text-accent-gold/60 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-dark-green font-playfair mb-2 font-semibold">No Videos Yet</h3>
            <p className="text-medium-grey text-sm font-light">
              We haven't added any video interviews to our gallery yet. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video.youtube_id)}
                className="bg-pure-white border border-light-grey rounded-2xl overflow-hidden group hover:shadow-md hover:border-medium-grey/25 transition-all duration-300 cursor-pointer flex flex-col shadow-sm"
              >
                {/* Thumbnail Wrapper */}
                <div className="relative aspect-video bg-black overflow-hidden shrink-0">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Black overlay */}
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-300"></div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-pure-white/90 hover:bg-pure-white text-[#B38728] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-all duration-300">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-5 flex-grow flex items-center bg-pure-white">
                  <h3 className="text-gray-800 font-bold text-sm sm:text-base leading-snug group-hover:text-primary-green transition-colors font-playfair line-clamp-2">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Desktop Lightbox Modal */}
      {selectedVideoId && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedVideoId(null)}
        >
          <div 
            className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideoId(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-pure-white p-2 rounded-full border border-white/20 transition-all z-50 cursor-pointer hover:scale-105"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
