import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, MessageCircle, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { submitNomination, getAwardCategories } from '../utils/api';

type Track = 'honorary' | 'rated';
type Package = 'identity' | 'change_maker' | 'fame_india' | 'impact_creator';

export default function ApplyAward() {
  const location = useLocation();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const stepTitles = ['Award Track', 'Personal Details', 'About Work', 'Review & Pay'];

  // Form states
  const [track, setTrack] = useState<Track>('honorary');
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    phone: '',
    email: '',
    city: '',
    category: '',
    description: '',
    link: '',
    package: 'identity' as Package,
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [businessLogo, setBusinessLogo] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [votingUrl, setVotingUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autofill category if passed from state
  useEffect(() => {
    if (location.state && (location.state as any).category) {
      setFormData((prev) => ({
        ...prev,
        category: (location.state as any).category,
      }));
    }
  }, [location]);

  // Dynamic Categories
  const [categoriesList, setCategoriesList] = useState<string[]>([
    'Eco-Friendly Product', 'Sustainable Manufacturer', 'Sustainable Construction',
    'Start-Up of the Year', 'Sustainable Innovation', 'Renewable Energy', 'Waste Management'
  ]); // Fallback initial state

  useEffect(() => {
    getAwardCategories().then(res => {
      if (res.success && res.data) {
        setCategoriesList(res.data.map((c: any) => c.name));
      }
    }).catch(err => console.error("Failed to load categories:", err));
  }, []);

  // Form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Step validations
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!formData.name.trim()) newErrors.name = 'Full Name is required';
      if (!formData.business.trim()) newErrors.business = 'Organisation name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Mobile number is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.city.trim()) newErrors.city = 'City & State is required';
      if (!profilePicture) newErrors.profilePicture = 'Profile Picture is required';
    }

    if (step === 3) {
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.description.trim()) {
        newErrors.description = 'Please describe your green work';
      } else if (formData.description.split(/\s+/).length > 200) {
        newErrors.description = 'Description must be 200 words or less';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (currentStep < totalSteps) {
      handleNext();
      return;
    }
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      try {
        const formDataPayload = new FormData();
        formDataPayload.append('track', track);
        formDataPayload.append('name', formData.name);
        formDataPayload.append('business', formData.business);
        formDataPayload.append('phone', formData.phone);
        formDataPayload.append('email', formData.email);
        formDataPayload.append('city', formData.city);
        formDataPayload.append('category', formData.category);
        formDataPayload.append('description', formData.description);
        if (formData.link) formDataPayload.append('link', formData.link);
        if (track === 'rated') formDataPayload.append('package', formData.package);
        if (profilePicture) formDataPayload.append('profilePicture', profilePicture);
        if (businessLogo) formDataPayload.append('businessLogo', businessLogo);

        const res = await submitNomination(formDataPayload);

        if (res.data?.voting_url) {
          setVotingUrl(res.data.voting_url);
        }

        // Trigger Zoho SMTP Email for honorary track immediately
        if (track === 'honorary') {
          try {
            const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
            const apiUrl = isProduction ? '/api/send-nomination' : `http://${window.location.hostname}:5000/api/send-nomination`;

            await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                track,
                category: formData.category,
                nomineeName: formData.name,
                companyName: formData.business,
                email: formData.email,
                phone: formData.phone,
                website: formData.link,
                votingUrl: res.data?.voting_url || '',
              })
            });
          } catch (emailErr) {
            console.error("Failed to send confirmation email:", emailErr);
          }
        }

        if (track === 'rated' && res.data && res.data.amount) {
          // Dynamic import to avoid circular dependency if any, or just use normal import
          const { createPaymentOrder } = await import('../utils/api');
          const { initiateRazorpayPayment } = await import('../utils/razorpay');
          
          const orderRes = await createPaymentOrder({ amount: res.data.amount });
          
          const orderId = orderRes.data?.order?.id;
          const keyId = orderRes.data?.key_id;

          if (!orderId || !keyId) {
            throw new Error("Invalid order response from server: Missing order ID or key ID");
          }

          initiateRazorpayPayment(
            {
              key_id: keyId,
              order_id: orderId,
              amount: res.data.amount,
              name: formData.name,
              description: `Nomination: ${formData.category}`,
              prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
              },
              module: 'nominations',
              record_id: res.data.id,
            },
            () => setSubmitted(true),
            (err) => alert(err.message || 'Payment failed or cancelled.')
          );
        } else {
          setSubmitted(true);
        }
      } catch (err: any) {
        alert(err.message || 'Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const nextButtonText = () => {
    if (currentStep === 1) return 'Continue to Details';
    if (currentStep === 2) return 'Continue to Impact';
    if (currentStep === 3) return 'Final Step: Review';
    return track === 'honorary' ? 'Submit Nomination' : 'Pay & Submit';
  };

  // Categories are now loaded dynamically from the database

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center font-inter">
        <div className="bg-pure-white p-12 rounded-3xl shadow-xl border border-light-grey max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-primary-green/10 text-primary-green rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-playfair font-bold text-dark-green mb-4">
            Nomination Received!
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you, <strong>{formData.name}</strong>. Your nomination for <strong>{formData.business}</strong> under the <strong>{formData.category}</strong> category has been successfully received.
          </p>

          {votingUrl && (
            <div className="bg-primary-green/10 p-6 border border-primary-green/30 rounded-2xl mb-8 text-center space-y-4 shadow-sm">
              <h3 className="font-bold text-dark-green text-lg uppercase tracking-wide">
                🎉 Your Unique Voting Link is Ready!
              </h3>
              <p className="text-sm text-medium-grey">
                Share this link with your network to start collecting votes:
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2 justify-center">
                <input 
                  type="text" 
                  readOnly 
                  value={votingUrl} 
                  className="w-full sm:w-auto flex-1 px-4 py-3 border border-primary-green/20 rounded-lg bg-pure-white text-dark-green text-sm font-medium focus:outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(votingUrl);
                    alert("Voting link copied to clipboard!");
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-primary-green text-pure-white font-bold rounded-lg hover:bg-dark-green transition-colors text-sm"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}

          <div className="bg-cream-white p-6 border border-light-grey rounded-2xl mb-8 text-left text-xs space-y-2">
            <p><strong>Track:</strong> {track === 'honorary' ? 'Honorary Award (Free)' : 'Rated Award Challenge'}</p>
            {track === 'rated' && (
              <p><strong>Package:</strong> {formData.package === 'identity' ? 'Identity (₹2,000)' : formData.package === 'change_maker' ? 'Change Maker (₹3,000)' : formData.package === 'fame_india' ? 'Fame of India (₹5,000)' : 'Impact Creator (₹10,000)'}</p>
            )}
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Status:</strong> Vetting in progress</p>
          </div>

          <p className="text-sm text-medium-grey mb-8">
            Our nominations steering team will verify your impact metrics and reach out to you on WhatsApp (+91 70411 51714) within 48 hours with creatives or verification credentials.
          </p>

          <div className="flex justify-center">
            <Link
              to="/"
              className="px-6 py-3 btn-premium-primary"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-white min-h-screen pb-16 font-inter">
      {/* Banner */}
      <div className="text-center py-12 relative max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pure-white border border-primary-green/20 rounded-full shadow-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-green"></span>
          </span>
          <span className="text-primary-green text-[10px] font-bold uppercase tracking-[0.2em]">
            Nominations Open for 2026
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-dark-green mb-4">
          Apply for Awards
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Submit your green enterprise nomination. Choose between the Free Honorary path or the competitive Rated challenge.
        </p>
      </div>

      {/* Main Wizard Form container */}
      <div className="max-w-3xl mx-auto bg-pure-white rounded-3xl shadow-xl overflow-hidden border border-light-grey mx-6 md:mx-auto">
        {/* Progress Header */}
        <div className="px-8 md:px-12 pt-8 pb-4 border-b border-light-grey bg-gradient-to-b from-gray-50/50 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <span className="inline-flex items-center px-3 py-1 bg-primary-green text-pure-white text-[10px] font-bold rounded-md uppercase tracking-widest mb-1.5">
                Step {currentStep} of {totalSteps}
              </span>
              <h2 className="text-lg font-bold text-dark-green">
                {stepTitles[currentStep - 1]}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-primary-green tracking-widest uppercase">
              <span className="opacity-40">Start</span>
              <div className="w-32 sm:w-48 bg-light-grey h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary-green h-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              <span className="opacity-40">Review</span>
            </div>
          </div>
        </div>

        {/* Wizard Form */}
        <div className="px-8 md:px-12 py-8">
          {/* STEP 1: CHOOSE TRACK */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <p className="text-sm text-medium-grey">
                Please select the track that matches your business model. Read the features of each track before proceeding.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Honorary Box */}
                <div
                  onClick={() => setTrack('honorary')}
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                    track === 'honorary'
                      ? 'border-primary-green bg-primary-green/5 shadow-md'
                      : 'border-light-grey bg-pure-white hover:border-primary-green/35'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-primary-green text-pure-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Free Track
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        track === 'honorary' ? 'border-primary-green' : 'border-light-grey'
                      }`}
                    >
                      {track === 'honorary' && (
                        <div className="w-3 h-3 rounded-full bg-primary-green"></div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-dark-green mb-2">Honorary Award</h3>
                  <p className="text-xs text-medium-grey mb-4">
                    For lifetime or legacy sector achievements. Strictly evaluated by our 50% jury framework.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary-green shrink-0" />
                      <span>Nomination is completely FREE (₹0)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary-green shrink-0" />
                      <span>100% merit-based Jury decision</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary-green shrink-0" />
                      <span>Free verification dashboard</span>
                    </li>
                  </ul>
                </div>

                {/* Rated Box */}
                <div
                  onClick={() => setTrack('rated')}
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                    track === 'rated'
                      ? 'border-primary-green bg-primary-green/5 shadow-md'
                      : 'border-light-grey bg-pure-white hover:border-primary-green/35'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-accent-gold text-pure-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Rated Challenge
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        track === 'rated' ? 'border-primary-green' : 'border-light-grey'
                      }`}
                    >
                      {track === 'rated' && (
                        <div className="w-3 h-3 rounded-full bg-primary-green"></div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-dark-green mb-2">Rated Awards</h3>
                  <p className="text-xs text-medium-grey mb-4">
                    A competitive campaign designed for startups & MSMEs to build validation and public reach.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary-green shrink-0" />
                      <span>Fee starts at ₹2,000</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary-green shrink-0" />
                      <span>75% Jury Weight + 25% Public Vote</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary-green shrink-0" />
                      <span>Voting link & creative templates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-dark-green">Enter Nominee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                    Nominee Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-cream-white/50 border rounded-lg focus:bg-pure-white focus:ring-2 focus:ring-primary-green/20 outline-none transition-all text-sm ${
                      errors.name ? 'border-alert-red' : 'border-light-grey'
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <span className="text-[10px] text-alert-red flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                    Business / Organisation Name *
                  </label>
                  <input
                    type="text"
                    name="business"
                    value={formData.business}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-cream-white/50 border rounded-lg focus:bg-pure-white focus:ring-2 focus:ring-primary-green/20 outline-none transition-all text-sm ${
                      errors.business ? 'border-alert-red' : 'border-light-grey'
                    }`}
                    placeholder="Enter company name"
                  />
                  {errors.business && (
                    <span className="text-[10px] text-alert-red flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.business}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-cream-white/50 border rounded-lg focus:bg-pure-white focus:ring-2 focus:ring-primary-green/20 outline-none transition-all text-sm ${
                      errors.phone ? 'border-alert-red' : 'border-light-grey'
                    }`}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-alert-red flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-cream-white/50 border rounded-lg focus:bg-pure-white focus:ring-2 focus:ring-primary-green/20 outline-none transition-all text-sm ${
                      errors.email ? 'border-alert-red' : 'border-light-grey'
                    }`}
                    placeholder="hello@greenpreneur.in"
                  />
                  {errors.email && (
                    <span className="text-[10px] text-alert-red flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </span>
                  )}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                    City & State *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-cream-white/50 border rounded-lg focus:bg-pure-white focus:ring-2 focus:ring-primary-green/20 outline-none transition-all text-sm ${
                      errors.city ? 'border-alert-red' : 'border-light-grey'
                    }`}
                    placeholder="Ahmedabad, Gujarat"
                  />
                  {errors.city && (
                    <span className="text-[10px] text-alert-red flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-light-grey">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                    Profile Picture *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProfilePicture(e.target.files[0]);
                        setErrors(prev => ({ ...prev, profilePicture: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2.5 bg-cream-white/50 border rounded-lg focus:bg-pure-white focus:ring-2 focus:ring-primary-green/20 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-green/10 file:text-primary-green hover:file:bg-primary-green/20 ${
                      errors.profilePicture ? 'border-alert-red' : 'border-light-grey'
                    }`}
                  />
                  {errors.profilePicture && (
                    <span className="text-[10px] text-alert-red flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.profilePicture}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                    Business Logo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBusinessLogo(e.target.files[0]);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-cream-white/50 border border-light-grey rounded-lg focus:bg-pure-white focus:ring-2 focus:ring-primary-green/20 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-green/10 file:text-primary-green hover:file:bg-primary-green/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ABOUT WORK */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-dark-green">Define Your Impact Sector</h3>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                    Award Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-cream-white/50 border rounded-lg focus:bg-pure-white outline-none transition-all text-sm appearance-none ${
                      errors.category ? 'border-alert-red' : 'border-light-grey'
                    }`}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categoriesList.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="text-[10px] text-alert-red flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.category}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                      Briefly describe your green work / impact *
                    </label>
                    <span className="text-[10px] text-medium-grey">Max 200 words</span>
                  </div>
                  <textarea
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-cream-white/50 border rounded-lg focus:bg-pure-white outline-none transition-all text-sm resize-none ${
                      errors.description ? 'border-alert-red' : 'border-light-grey'
                    }`}
                    placeholder="Provide details about your waste handling/sustainability metrics..."
                  ></textarea>
                  {errors.description && (
                    <span className="text-[10px] text-alert-red flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-medium-grey">
                    Website or Social Profile link (Optional)
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-cream-white/50 border border-light-grey rounded-lg focus:bg-pure-white outline-none transition-all text-sm"
                    placeholder="https://mywebsite.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & SUBMIT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {track === 'rated' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-dark-green mb-1">
                      Select Challenge Entry Package
                    </h3>
                    <p className="text-xs text-medium-grey">
                      Our Rated Challenge helps you garner votes. Choose a validation tier.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Package 1: Identity */}
                    <label
                      className={`border-2 rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                        formData.package === 'identity'
                          ? 'border-primary-green bg-primary-green/5 shadow-md'
                          : 'border-light-grey bg-pure-white hover:border-primary-green/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="package"
                        value="identity"
                        checked={formData.package === 'identity'}
                        onChange={() => setFormData((p) => ({ ...p, package: 'identity' }))}
                        className="sr-only"
                      />
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-dark-green">Identity Package</span>
                          <span className="text-xl font-bold text-primary-green">₹2,000</span>
                        </div>
                        <p className="text-[10px] text-medium-grey italic mb-4">
                          "Your first step to shine in the Greenpreneur journey."
                        </p>
                        
                        <ul className="space-y-2 mb-4 text-[10px] text-gray-700 flex-1">
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-primary-green shrink-0 mt-0.5" />
                            <span>Free entry to Greenpreneur 2026 (Worth of ₹2,000)</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-primary-green shrink-0 mt-0.5" />
                            <span>Vyapaar Jagat Story Publication (worth ₹25,000+) & Business Listing (worth ₹10,000+)</span>
                          </li>
                        </ul>
                        
                        <div className="pt-3 border-t border-light-grey mt-auto">
                          <p className="text-[9px] text-medium-grey leading-tight">
                            <span className="font-bold text-dark-green">Positioning:</span> For those who want recognition and visibility.
                          </p>
                        </div>
                      </div>
                    </label>

                    {/* Package 2: Change Maker */}
                    <label
                      className={`border-2 rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                        formData.package === 'change_maker'
                          ? 'border-primary-green bg-primary-green/5 shadow-md'
                          : 'border-light-grey bg-pure-white hover:border-primary-green/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="package"
                        value="change_maker"
                        checked={formData.package === 'change_maker'}
                        onChange={() => setFormData((p) => ({ ...p, package: 'change_maker' }))}
                        className="sr-only"
                      />
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-dark-green">Change Maker</span>
                          <span className="text-xl font-bold text-primary-green">₹3,000</span>
                        </div>
                        <p className="text-[10px] text-medium-grey italic mb-4">
                          "Join the tribe of changemakers."
                        </p>
                        
                        <ul className="space-y-2 mb-4 text-[10px] text-gray-700 flex-1">
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-primary-green shrink-0 mt-0.5" />
                            <span className="font-semibold text-primary-green">All Identity Package benefits</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-primary-green shrink-0 mt-0.5" />
                            <span>Lifetime Greenpreneur Membership (permanent identity in the network, worth ₹50,000+)</span>
                          </li>
                        </ul>
                        
                        <div className="pt-3 border-t border-light-grey mt-auto">
                          <p className="text-[9px] text-medium-grey leading-tight">
                            <span className="font-bold text-dark-green">Positioning:</span> For changemakers building impact.
                          </p>
                        </div>
                      </div>
                    </label>

                    {/* Package 3: Fame of India */}
                    <label
                      className={`border-2 rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                        formData.package === 'fame_india'
                          ? 'border-accent-gold bg-accent-gold/5 shadow-md'
                          : 'border-light-grey bg-pure-white hover:border-accent-gold/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="package"
                        value="fame_india"
                        checked={formData.package === 'fame_india'}
                        onChange={() => setFormData((p) => ({ ...p, package: 'fame_india' }))}
                        className="sr-only"
                      />
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-dark-green">Fame of India</span>
                          <span className="text-xl font-bold text-accent-gold">₹5,000</span>
                        </div>
                        <p className="text-[10px] text-medium-grey italic mb-4">
                          "Be celebrated nationally."
                        </p>
                        
                        <ul className="space-y-2 mb-4 text-[10px] text-gray-700 flex-1">
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-accent-gold shrink-0 mt-0.5" />
                            <span className="font-semibold text-accent-gold">All Change Maker benefits</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-accent-gold shrink-0 mt-0.5" />
                            <span>Digital Coffee Table Book Media Coverage (digital showcase for wide visibility, worth ₹15,000+)</span>
                          </li>
                        </ul>
                        
                        <div className="pt-3 border-t border-light-grey mt-auto">
                          <p className="text-[9px] text-medium-grey leading-tight">
                            <span className="font-bold text-dark-green">Positioning:</span> For entrepreneurs wanting public visibility.
                          </p>
                        </div>
                      </div>
                    </label>

                    {/* Package 4: Impact Creator */}
                    <label
                      className={`border-2 rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden ${
                        formData.package === 'impact_creator'
                          ? 'border-accent-gold bg-accent-gold/5 shadow-md'
                          : 'border-light-grey bg-pure-white hover:border-accent-gold/30'
                      }`}
                    >
                      <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 z-10 pointer-events-none">
                        <div className="absolute top-4 -right-8 bg-accent-gold text-pure-white text-[8px] font-bold py-1 px-10 transform rotate-45 shadow-sm uppercase tracking-widest">
                          Popular
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="package"
                        value="impact_creator"
                        checked={formData.package === 'impact_creator'}
                        onChange={() => setFormData((p) => ({ ...p, package: 'impact_creator' }))}
                        className="sr-only"
                      />
                      <div className="flex flex-col h-full relative z-0">
                        <div className="flex justify-between items-center mb-1 pr-8">
                          <span className="font-bold text-sm text-dark-green">Impact Creator</span>
                          <span className="text-xl font-bold text-accent-gold">₹10,000</span>
                        </div>
                        <p className="text-[10px] text-medium-grey italic mb-4 pr-8">
                          "Leave a lasting legacy."
                        </p>
                        
                        <ul className="space-y-2 mb-4 text-[10px] text-gray-700 flex-1">
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-accent-gold shrink-0 mt-0.5" />
                            <span className="font-semibold text-accent-gold">All Fame of India benefits</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-accent-gold shrink-0 mt-0.5" />
                            <span>Physical Coffee Table Book Media Coverage (featured in a prestigious printed edition, worth ₹20,000+)</span>
                          </li>
                        </ul>
                        
                        <div className="pt-3 border-t border-light-grey mt-auto">
                          <p className="text-[9px] text-medium-grey leading-tight">
                            <span className="font-bold text-dark-green">Positioning:</span> For entrepreneurs creating long-term impact.
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Payment account details */}
                  <div className="bg-cream-white border border-light-grey rounded-2xl p-6 space-y-4">
                    <h4 className="text-[10px] font-bold text-dark-green uppercase tracking-widest border-b border-light-grey pb-2">
                      Transfer Credentials (No GST Applicable)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="block text-medium-grey font-semibold mb-0.5">UPI Code:</span>
                        <span className="font-mono text-primary-green font-bold">
                          eazypay.0000054327@icici
                        </span>
                      </div>
                      <div>
                        <span className="block text-medium-grey font-semibold mb-0.5">ICICI Savings:</span>
                        <span>A/c: 471401000076 | IFSC: ICIC0004714</span>
                        <span className="block text-[10px] text-medium-grey">AEC Cross Road, Ahmedabad</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-[10px] text-medium-grey text-center italic">
                        You will be redirected to the secure Razorpay checkout after clicking "Pay & Submit".
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary-green" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0D3D20] mb-2 font-playfair">
                    Review Your Details
                  </h3>
                  <p className="text-xs text-medium-grey max-w-sm mx-auto">
                    You have selected the <strong>Honorary Track (Free nomination)</strong>. Review your application data below and click submit to send it directly to our jury panel.
                  </p>
                </div>
              )}

              {/* General Summary Card */}
              <div className="border border-light-grey rounded-2xl p-6 bg-gray-50 text-xs space-y-3">
                <h4 className="font-bold text-dark-green uppercase tracking-wider border-b pb-2">
                  Nomination Info Summary
                </h4>
                <div className="grid grid-cols-2 gap-y-2">
                  <span className="text-medium-grey font-semibold">Nominee Name:</span>
                  <span>{formData.name || 'Not provided'}</span>
                  <span className="text-medium-grey font-semibold">Business:</span>
                  <span>{formData.business || 'Not provided'}</span>
                  <span className="text-medium-grey font-semibold">Category:</span>
                  <span>{formData.category || 'Not provided'}</span>
                  <span className="text-medium-grey font-semibold">Track selected:</span>
                  <span className="capitalize">{track}</span>
                  {track === 'rated' && (
                    <>
                      <span className="text-medium-grey font-semibold">Challenge Package:</span>
                      <span className="capitalize">{formData.package}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-light-grey flex justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-3 border border-light-grey text-medium-grey rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-cream-white transition-all flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <button
                key="next-btn"
                type="button"
                onClick={handleNext}
                className="px-8 py-3 btn-premium-primary flex items-center gap-1"
              >
                {nextButtonText()} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                key="submit-btn"
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className={`px-8 py-3 btn-premium-primary flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : nextButtonText()}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Support Box */}
      <div className="max-w-3xl mx-auto mt-12 px-6">
        <div className="bg-dark-green rounded-2xl p-8 text-pure-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <span className="text-accent-gold text-[10px] font-bold uppercase tracking-wider">
              Secretariat Desk
            </span>
            <h3 className="text-2xl font-playfair font-bold mt-1">Need help filling the form?</h3>
            <p className="text-xs text-pure-white/70 max-w-md mt-2">
              Our coordinators help verify your documents and register categories correctly. Reach out directly.
            </p>
          </div>
          <a
            href="https://wa.me/917041151714"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-pure-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#1fae53] transition-all shadow-md"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp Help
          </a>
        </div>
      </div>
    </div>
  );
}
