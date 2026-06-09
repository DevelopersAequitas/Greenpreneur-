import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPublicNominee, voteNominee, ASSETS_BASE_URL } from '../utils/api';
import type { PublicNominee } from '../utils/api';
import { Loader2, Award, Trophy, Leaf } from 'lucide-react';
import './VoteNominee.css';

const COLORS = ['#D4AF37','#F5D87A','#ffffff','#1E6B3C','#5DCAA5','#B8962E','#FFE97A'];

const TextTruncate = ({ text, maxLines = 3 }: { text: string, maxLines?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setShowButton(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [text]);

  if (!text) return null;

  return (
    <div>
      <div 
        ref={textRef} 
        style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: isExpanded ? 'unset' : maxLines, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      >
        {text}
      </div>
      {showButton && (
        <button 
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ color: '#E2C073', fontSize: '11px', fontWeight: 600, marginTop: '4px', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          className="hover:text-white transition-colors"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

export default function VoteNominee() {
  const { slug } = useParams<{ slug: string }>();
  const idStr = slug?.split('-')[0];
  const id = parseInt(idStr || '0', 10);
  const navigate = useNavigate();

  const [nominee, setNominee] = useState<PublicNominee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    business: '',
    designation: '',
    phone: '',
    city: '',
    remarks: '',
    email: '',
  });

  const [voting, setVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteError, setVoteError] = useState('');

  const vBtnRef = useRef<HTMLButtonElement>(null);
  const vConfettiRef = useRef<HTMLDivElement>(null);
  const wConfettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNominee = async () => {
      try {
        const res = await getPublicNominee(id);
        setNominee(res.data || null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch nominee data.');
      } finally {
        setLoading(false);
      }
    };
    if (id > 0) fetchNominee();
    else {
      setError('Invalid voting URL.');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (nominee?.status === 'winner' && wConfettiRef.current) {
      const container = wConfettiRef.current;
      container.innerHTML = '';
      const totalPieces = 55;
      for (let i = 0; i < totalPieces; i++) {
        const p = document.createElement('div');
        p.className = 'wcp';
        const size = 5 + Math.random() * 9;
        const dur = 3 + Math.random() * 4;
        const sway = 2 + Math.random() * 3;
        const isCircle = Math.random() > 0.4;
        p.style.cssText = `
          left:${Math.random() * 100}%;
          width:${size}px;
          height:${size}px;
          background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
          border-radius:${isCircle ? '50%' : '2px'};
          animation-duration:${dur}s,${sway}s;
          animation-delay:${Math.random() * dur}s,${Math.random() * sway}s;
          opacity:.7;
        `;
        container.appendChild(p);
      }
    }
  }, [nominee, loading]);

  const fireButtonConfetti = (container: HTMLDivElement | null, btn: HTMLButtonElement | null) => {
    if (btn) {
      btn.classList.remove('pop');
      void btn.offsetWidth;
      btn.classList.add('pop');
    }
    if (container) {
      container.innerHTML = '';
      const count = 28;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'cp active';
        const size = 5 + Math.random() * 7;
        const isCircle = Math.random() > 0.5;
        p.style.cssText = `
          left:${10 + Math.random() * 80}%;
          top:0;
          width:${size}px;
          height:${size}px;
          background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
          border-radius:${isCircle ? '50%' : '2px'};
          animation-duration:${0.7 + Math.random() * 0.7}s,${0.3 + Math.random() * 0.3}s;
          animation-delay:${Math.random() * 0.25}s,${Math.random() * 0.25}s;
          transform:rotate(${Math.random() * 360}deg);
        `;
        container.appendChild(p);
      }
      setTimeout(() => {
        if (container) container.innerHTML = '';
      }, 1600);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    setVoteError('');
    setVoting(true);

    try {
      await voteNominee(id, formData);
      setVoteSuccess(true);
      fireButtonConfetti(vConfettiRef.current, vBtnRef.current);
      if (nominee) {
        setNominee({ ...nominee, vote_count: nominee.vote_count + 1 });
      }
      setFormData({ name: '', business: '', designation: '', phone: '', city: '', remarks: '', email: '' });
    } catch (err: any) {
      setVoteError(err.message || 'Failed to submit vote.');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080F09] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (error || !nominee) {
    return (
      <div className="min-h-screen bg-[#080F09] flex items-center justify-center p-6 font-inter">
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md text-center border border-white/10">
          <p className="text-red-400 font-medium mb-4">{error || 'Nominee not found.'}</p>
          <Link to="/" className="text-[#D4AF37] font-medium underline text-sm hover:text-white transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const initials = nominee.nominee_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col w-full">
      <div className="v-page flex-1 flex items-center justify-center" style={{ minHeight: 'auto', padding: '2rem 1rem' }}>
        {nominee.status !== 'winner' ? (
        /* ═══ VOTING PAGE ═══ */
        <div className="v-wrap">
          <div className="gold-bar"></div>
          <div className="ticket-wrap">
            <div className="ticket">
              <div className="ticket-top">
                <div className="av-wrap">
                  <div className="av-ring2"></div><div className="av-ring"></div>
                  <div className="av">
                    {nominee.profile_picture ? (
                      <img src={`${ASSETS_BASE_URL}${nominee.profile_picture}`} alt={nominee.nominee_name} />
                    ) : (
                      initials
                    )}
                  </div>
                </div>
                <div className="ticket-info">
                  <div className="t-badge"><div className="t-badge-dot"></div> Official nominee &middot; 2026</div>
                  <div className="t-name" style={{ wordBreak: 'break-word' }}>{nominee.nominee_name}</div>
                  <div className="t-biz">
                    <TextTruncate text={nominee.business_name || ''} maxLines={2} />
                  </div>
                  <div className="t-cat">{nominee.category}</div>
                  {nominee.description && (
                    <div className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <TextTruncate text={nominee.description} maxLines={3} />
                    </div>
                  )}
                </div>
                <div className="vote-badge">
                  <div className="vote-n">{nominee.vote_count}</div>
                  <div className="vote-l">Votes</div>
                </div>
              </div>
              <div className="perf">
                <div className="perf-notch"></div><div className="perf-dashes"></div><div className="perf-notch"></div>
              </div>
              <div className="ticket-bot">
                <div className="tb-item"><div className="tb-lbl">Category</div><div className="tb-val">{nominee.category}</div></div>
                <div className="tb-sep"></div>
                <div className="tb-item"><div className="tb-lbl">Award year</div><div className="tb-val">2026</div></div>
                <div className="tb-sep"></div>
                <div className="tb-item"><div className="tb-lbl">Status</div><div className="tb-val"><span className="status-dot"></span>Voting open</div></div>
              </div>
            </div>
          </div>
          <div className="ornament">
            <div className="orn-line"></div><div className="orn-diamond"></div>
            <div className="orn-text">Cast your vote</div>
            <div className="orn-diamond"></div><div className="orn-line"></div>
          </div>
          <div className="form-section">
            <div className="form-header">
              <div className="form-title">Your endorsement matters</div>
              <div className="form-sub">One vote per email &middot; Results at the Greenpreneur ceremony</div>
            </div>
            
            {voteSuccess && (
              <div className="mb-4 p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-center text-[#D4AF37] text-xs font-medium">
                Thank you! Your vote has been recorded successfully.
              </div>
            )}
            
            {voteError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center text-red-400 text-xs font-medium">
                {voteError}
              </div>
            )}

            <form onSubmit={handleVote}>
              <div className="field">
                <label className="lbl">Full name *</label>
                <input required className="inp" placeholder="Your full name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="field">
                <label className="lbl">Email address *</label>
                <input required type="email" className="inp" placeholder="your@email.com" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="g2" style={{ marginBottom: '10px' }}>
                <div className="field" style={{ margin: 0 }}>
                  <label className="lbl">Business</label>
                  <input className="inp" placeholder="Company" name="business" value={formData.business} onChange={handleChange} />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label className="lbl">Designation</label>
                  <input className="inp" placeholder="Your role" name="designation" value={formData.designation} onChange={handleChange} />
                </div>
              </div>
              <div className="g2" style={{ marginBottom: '10px' }}>
                <div className="field" style={{ margin: 0 }}>
                  <label className="lbl">Phone</label>
                  <input className="inp" placeholder="+91" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label className="lbl">City</label>
                  <input className="inp" placeholder="Your city" name="city" value={formData.city} onChange={handleChange} />
                </div>
              </div>
              <div className="field">
                <label className="lbl">Why you support this nominee</label>
                <input className="inp" placeholder="Share your reason…" name="remarks" value={formData.remarks} onChange={handleChange} />
              </div>
              <div className="btn-wrap">
                <div className="confetti-canvas" ref={vConfettiRef}></div>
                <button type="submit" className="btn" ref={vBtnRef} disabled={voting}>
                  {voting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />} 
                  {voting ? 'Submitting...' : 'Submit my vote'}
                </button>
              </div>
            </form>
            <div className="dots-row">
              <div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div>
            </div>
          </div>
        </div>
      ) : (
        /* ═══ WINNER PAGE ═══ */
        <div className="w-wrap">
          <div className="w-gold-bar"></div>

          {/* background confetti */}
          <div className="w-confetti" ref={wConfettiRef}></div>

          <div className="w-header">
            <div className="w-edition">Greenpreneur Awards &middot; 2026</div>
            <div className="crown-wrap">
               {/* Replace external font icon with standard svg */}
               <Trophy className="crown-icon w-10 h-10" />
            </div>
            <div className="w-av-wrap">
              <div className="sparkle"></div><div className="sparkle"></div><div className="sparkle"></div>
              <div className="sparkle"></div><div className="sparkle"></div>
              <div className="w-av-r3"></div><div className="w-av-r2"></div><div className="w-av-r1"></div>
              <div className="w-av">
                {nominee.profile_picture ? (
                  <img src={`${ASSETS_BASE_URL}${nominee.profile_picture}`} alt={nominee.nominee_name} />
                ) : (
                  initials
                )}
              </div>
            </div>
            <div className="w-name" style={{ wordBreak: 'break-word' }}>{nominee.nominee_name}</div>
            <div className="w-biz">
              <TextTruncate text={nominee.business_name || ''} maxLines={2} />
            </div>
            <div className="w-cat">{nominee.category} &middot; Hall of Fame</div>
          </div>

          <div className="ribbon-wrap">
            <div className="ribbon">
              <div className="ribbon-item"><div className="ribbon-n">{nominee.vote_count || 1284}</div><div className="ribbon-l">Total votes</div></div>
              <div className="ribbon-sep"></div>
              <div className="ribbon-item"><div className="ribbon-n">#1</div><div className="ribbon-l">Category rank</div></div>
              <div className="ribbon-sep"></div>
              <div className="ribbon-item"><div className="ribbon-n">2026</div><div className="ribbon-l">Award year</div></div>
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-lbl"><span>Votes vs runner-up</span><strong>84% lead</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: '84%' }}></div></div>
          </div>

          <div className="w-body">
            <div className="w-body-top">
              <div className="w-body-title"><Leaf className="w-4 h-4" /> Green impact</div>
              <div className="w-desc">
                <TextTruncate text={nominee.description || 'Pioneering sustainable solutions for a greener tomorrow.'} maxLines={4} />
              </div>
            </div>
            <div className="w-cta-wrap">
              <button className="w-btn" onClick={() => navigate('/winners')}>
                <Trophy className="w-4 h-4" /> View all winners
              </button>
            </div>
          </div>

          <div className="w-orn">
            <div className="w-orn-line"></div><div className="w-orn-d"></div>
            <div className="w-orn-txt">Greenpreneur &middot; Green India &middot; 2026</div>
            <div className="w-orn-d"></div><div className="w-orn-line"></div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
