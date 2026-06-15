import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import { getBlogBySlug, ASSETS_BASE_URL } from '../utils/api';
import type { Blog } from '../utils/api';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBlog() {
      if (!slug) return;
      try {
        const res = await getBlogBySlug(slug);
        if (res.success && res.data) {
          setBlog(res.data);
        } else {
          // Redirect to blogs list if not found
          navigate('/blogs');
        }
      } catch (err) {
        console.error('Failed to load blog post:', err);
        navigate('/blogs');
      } finally {
        setIsLoading(false);
      }
    }
    loadBlog();
  }, [slug, navigate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="bg-cream-white min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-green animate-spin" />
        <p className="text-medium-grey text-sm font-medium">Loading article details...</p>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="bg-cream-white min-h-screen font-inter pb-20">
      {/* Detail Header hero */}
      <header className="relative bg-dark-green py-20 px-6 overflow-hidden text-center border-b border-accent-gold/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,107,60,0.4),transparent)]"></div>
          <div className="absolute inset-0 heritage-ornament opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold text-accent-gold/80 hover:text-accent-gold uppercase tracking-wider mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
          
          <h1 className="text-pure-white text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-6 leading-tight max-w-3xl mx-auto">
            {blog.title}
          </h1>

          <div className="flex justify-center items-center gap-6 text-xs sm:text-sm text-pure-white/70 font-light">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-accent-gold" />
              {formatDate(blog.created_at)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold/40"></span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-accent-gold" />
              {blog.author}
            </span>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <main className="px-6 max-w-4xl mx-auto -mt-8 relative z-20">
        <div className="bg-pure-white rounded-2xl border border-light-grey shadow-lg overflow-hidden">
          {/* Featured Image */}
          {blog.featured_image && !(blog.content.includes('<img') || blog.content.includes('<figure')) ? (
            <div className="w-full h-[300px] sm:h-[420px] border-b border-light-grey relative overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={`${ASSETS_BASE_URL}${blog.featured_image}`}
                alt={blog.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full min-h-[180px] bg-gradient-to-br from-primary-green/5 to-accent-gold/10 flex items-center justify-center border-b border-light-grey p-8 text-center">
              <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-dark-green leading-tight max-w-2xl">
                {blog.title}
              </h2>
            </div>
          )}

          {/* Full content description */}
          <div className="p-8 sm:p-12">
            <div 
              className="prose prose-emerald max-w-none text-gray-700 leading-relaxed font-light space-y-6 text-sm sm:text-base break-words"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
