import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Search, BookOpen, Loader2, ArrowRight } from 'lucide-react';
import { getBlogs, ASSETS_BASE_URL } from '../utils/api';
import type { Blog } from '../utils/api';

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await getBlogs();
        if (res.success && res.data) {
          setBlogs(res.data);
        }
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    blog =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getExcerpt = (htmlContent: string) => {
    // Basic tag removal and text snippet extraction
    const text = htmlContent.replace(/<[^>]*>/g, '');
    return text.length > 130 ? text.substring(0, 127) + '...' : text;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-cream-white min-h-screen font-inter">
      {/* Hero Section */}
      <header className="relative bg-dark-green py-20 px-6 overflow-hidden text-center border-b border-accent-gold/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,107,60,0.4),transparent)]"></div>
          <div className="absolute inset-0 heritage-ornament opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent-gold/25 text-accent-gold border border-accent-gold/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Insights & Stories
          </div>
          <h1 className="text-pure-white text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-6">
            Greenpreneur Blogs
          </h1>
          <p className="text-pure-white/70 text-base sm:text-lg font-light mb-10 max-w-2xl mx-auto">
            Stay informed with the latest updates, leadership knowledge, and success stories in green entrepreneurship.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto shadow-xl rounded-xl">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-accent-gold" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-pure-white text-dark-text py-4 pl-14 pr-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-gold text-sm border border-light-grey font-medium shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* Blogs Grid */}
      <main className="py-20 px-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-primary-green animate-spin" />
            <p className="text-medium-grey text-sm font-medium">Loading insights...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-pure-white border border-light-grey rounded-2xl p-16 text-center max-w-md mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-accent-gold/60 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-dark-green font-playfair mb-2">No Articles Found</h3>
            <p className="text-medium-grey text-sm font-light mb-6">
              {searchQuery ? "We couldn't find any post matching your search terms." : "No blog posts have been published yet. Check back soon!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-primary-green font-bold underline hover:text-dark-green"
              >
                Clear search filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map(blog => (
              <article
                key={blog.id}
                className="bg-pure-white rounded-2xl border border-light-grey shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-medium-grey/25 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="h-52 bg-gray-100 overflow-hidden relative border-b border-light-grey shrink-0">
                  {blog.featured_image ? (
                    <img
                      src={`${ASSETS_BASE_URL}${blog.featured_image}`}
                      alt={blog.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 bg-gray-50"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-green/20 to-accent-gold/25 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-dark-green/30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-dark-green/90 text-pure-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md backdrop-blur-sm">
                    Read Post
                  </div>
                </div>

                {/* Content info */}
                <div className="p-6 flex-grow flex flex-col">
                  {/* Meta row */}
                  <div className="flex items-center gap-4 text-[11px] text-medium-grey font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-accent-gold" />
                      {formatDate(blog.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-accent-gold" />
                      {blog.author}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-dark-green font-playfair mb-3 leading-snug group-hover:text-primary-green transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed mb-6 flex-grow line-clamp-3">
                    {getExcerpt(blog.content)}
                  </p>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B38728] uppercase tracking-wider hover:text-dark-green group/btn transition-colors"
                    >
                      Read More 
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
