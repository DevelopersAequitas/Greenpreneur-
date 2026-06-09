import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { InquiryForm } from '../components/InquiryForm';
import { motion } from 'framer-motion';

const INQUIRY_CONFIG: Record<string, {
  title: string;
  description: string;
  showBudget?: boolean;
  showFiles?: boolean;
  showInterests?: boolean;
  interestOptions?: string[];
  file1Label?: string;
  file2Label?: string;
}> = {
  'apply-magazine': {
    title: 'Apply for Magazine Feature',
    description: 'Get your inspiring story featured in our prestigious Greenpreneur Magazine.',
    showFiles: true,
    file1Label: 'Founder Photo',
    file2Label: 'Company Logo'
  },
  'advertise-magazine': {
    title: 'Advertise in Our Magazine',
    description: 'Reach thousands of eco-conscious leaders and businesses.',
    showBudget: true,
    showInterests: true,
    interestOptions: ['Full Page Ad', 'Half Page Ad', 'Cover Feature', 'Sponsored Article']
  },
  'sponsor': {
    title: 'Become a Sponsor',
    description: 'Support our initiatives and gain premium brand visibility across our global network.',
    showBudget: true,
    showInterests: true,
    interestOptions: ['Title Sponsor', 'Category Sponsor', 'Event Sponsor', 'Digital Sponsor']
  },
  'partner': {
    title: 'Apply as a Partner',
    description: 'Join hands with Greenpreneur to co-create sustainable impact and reach new audiences.',
    showFiles: true,
    file1Label: 'Founder Image',
    file2Label: 'Organization Logo'
  },
  'advertise-us': {
    title: 'Advertise with Us',
    description: 'Promote your green products or services across our digital platforms and events.',
    showBudget: true,
    showInterests: true,
    interestOptions: ['Website Banners', 'Newsletter Shoutouts', 'Social Media', 'Event Kiosks']
  },
  'collaborate': {
    title: 'Collaboration & Partnership',
    description: 'Let us collaborate on innovative sustainability projects and initiatives.',
    showFiles: true,
    file1Label: 'Proposal Deck (PDF/Image)',
    file2Label: 'Organization Logo'
  },
  'fundraise': {
    title: 'Join to Fundraise',
    description: 'Are you a green startup looking for capital? Apply to pitch to our network of eco-investors.',
    showBudget: true,
    showFiles: true,
    file1Label: 'Pitch Deck',
    file2Label: 'Founder Photo'
  },
  'invest': {
    title: 'Join to Invest',
    description: 'Become part of our exclusive investor network funding the next generation of green unicorns.',
    showBudget: true,
    showInterests: true,
    interestOptions: ['Pre-seed', 'Seed', 'Series A', 'Growth Equity']
  },
  'membership': {
    title: 'Membership Inquiry',
    description: 'Join the Greenpreneur community to network, learn, and grow with like-minded leaders.'
  },
  'publish-story': {
    title: 'Publish Your Story',
    description: 'Share your sustainability journey, challenges, and successes with our global audience.',
    showFiles: true,
    file1Label: 'Author Photo',
    file2Label: 'Related Image'
  },
  'speaker-application': {
    title: 'Speaker Applications',
    description: 'Apply to speak at our upcoming Greenpreneur conferences and summits.',
    showFiles: true,
    file1Label: 'Speaker Headshot',
    file2Label: 'Speaker Profile/Bio'
  },
  'start-chapter': {
    title: 'Start A Chapter',
    description: 'Bring the Greenpreneur movement to your city. Apply to become a Chapter Lead.'
  },
  'talk-show-speaker': {
    title: 'Apply for Talk Show Speakers',
    description: 'Want to be interviewed on the Voice of Greenpreneur Talk Show? Send us your details!',
    showFiles: true,
    file1Label: 'Speaker Image',
    file2Label: 'Company Logo'
  }
};

export default function InquiryPage() {
  const { type } = useParams<{ type: string }>();

  if (!type || !INQUIRY_CONFIG[type]) {
    return <Navigate to="/" replace />;
  }

  const config = INQUIRY_CONFIG[type];

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            Greenpreneur Opportunities
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Connect</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Fill out the form below to get started. Our team will review your application and respond shortly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <InquiryForm
            inquiryType={type}
            title={config.title}
            description={config.description}
            showBudget={config.showBudget}
            showFiles={config.showFiles}
            showInterests={config.showInterests}
            interestOptions={config.interestOptions}
            file1Label={config.file1Label}
            file2Label={config.file2Label}
          />
        </motion.div>
      </div>
    </div>
  );
}
