import React, { useState } from 'react';
import { Mail, Phone, Building2, UserCircle, Link as LinkIcon, UploadCloud, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';

export interface InquiryFormProps {
  inquiryType: string;
  title: string;
  description?: string;
  showBudget?: boolean;
  showFiles?: boolean;
  showInterests?: boolean;
  interestOptions?: string[];
  file1Label?: string;
  file2Label?: string;
}

export function InquiryForm({
  inquiryType,
  title,
  description,
  showBudget = false,
  showFiles = false,
  showInterests = false,
  interestOptions = [],
  file1Label = 'Attachment 1',
  file2Label = 'Attachment 2'
}: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    website_link: '',
    budget_range: '',
    message: ''
  });

  const [interests, setInterests] = useState<string[]>([]);
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileNumber: 1 | 2) => {
    if (e.target.files && e.target.files.length > 0) {
      if (fileNumber === 1) setFile1(e.target.files[0]);
      else setFile2(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('inquiry_type', inquiryType);
      
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Append interests
      if (showInterests && interests.length > 0) {
        data.append('interests', JSON.stringify(interests));
      }

      // Append files
      if (showFiles) {
        if (file1) data.append('file1', file1);
        if (file2) data.append('file2', file2);
      }

      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const apiUrl = isProduction ? '/api/inquiries' : `http://${window.location.hostname}:5000/api/inquiries`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: data
      });

      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Failed to submit form.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-green-100 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-slate-800 mb-4">Request Submitted Successfully!</h3>
        <p className="text-slate-600 text-lg">
          Thank you for reaching out. Our team will review your application and get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-green-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">{title}</h2>
        {description && <p className="text-slate-600">{description}</p>}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Organization</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="Company Name"
              />
            </div>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Designation</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="CEO / Founder"
              />
            </div>
          </div>

          {/* Website Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Website / LinkedIn</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="url"
                name="website_link"
                value={formData.website_link}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="https://"
              />
            </div>
          </div>
        </div>

        {/* Budget Range */}
        {showBudget && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Budget Range</label>
            <select
              name="budget_range"
              value={formData.budget_range}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
            >
              <option value="">Select a range</option>
              <option value="Below 1 Lakh">Below 1 Lakh</option>
              <option value="1 - 5 Lakh">1 - 5 Lakh</option>
              <option value="5 - 10 Lakh">5 - 10 Lakh</option>
              <option value="Above 10 Lakh">Above 10 Lakh</option>
            </select>
          </div>
        )}

        {/* Interests Checkboxes */}
        {showInterests && interestOptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Areas of Interest</label>
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((option, idx) => (
                <label key={idx} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={interests.includes(option)}
                    onChange={() => handleInterestToggle(option)}
                    className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-slate-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* File Uploads */}
        {showFiles && (
          <div className="grid md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{file1Label} (Max 10MB)</label>
              <div className="relative">
                <UploadCloud className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 1)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{file2Label} (Max 10MB)</label>
              <div className="relative">
                <UploadCloud className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 2)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
              placeholder="Tell us more about your inquiry..."
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all ${
            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>
    </div>
  );
}
