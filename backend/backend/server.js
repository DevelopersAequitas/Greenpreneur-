// =============================================================================
// Greenpreneur — Unified Production Server
// Handles: API, Email Notifications, Static Frontend, Uploads
// Entry: backend/backend/server.js
// =============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

import nominationsRouter from './routes/nominations.js';
import eventRouter from './routes/events.js';
import sponsorshipRouter from './routes/sponsorships.js';
import coffeeBookRouter from './routes/coffeeBook.js';
import contactRouter from './routes/contact.js';
import communityRouter from './routes/community.js';
import winnersRouter from './routes/winners.js';
import paymentRouter from './routes/payment.js';
import inquiriesRouter from './routes/inquiries.js';
import adminRouter from './routes/admin.js';
import blogsRouter from './routes/blogs.js';
import voiceVideosRouter from './routes/voiceVideos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (needed for Hostinger/Nginx to read the correct IP for rate limiting)
app.set('trust proxy', 1);

// ── Security & Middleware ─────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // allow React app assets
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',

  // Live domain before SSL
  'http://greenpreneur.in',
  'http://www.greenpreneur.in',

  // Live domain after SSL
  'https://greenpreneur.in',
  'https://www.greenpreneur.in',
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  return origin.replace(/\/$/, '');
};

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server requests, curl, Postman, same-origin calls without Origin header
    if (!origin) return callback(null, true);

    const cleanOrigin = normalizeOrigin(origin);

    const isLocal =
      cleanOrigin.startsWith('http://localhost') ||
      cleanOrigin.startsWith('http://127.0.0.1') ||
      /^http:\/\/(?:192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?::\d+)?$/.test(cleanOrigin);

    const isGreenpreneurDomain =
      /^https?:\/\/(www\.)?greenpreneur\.in$/.test(cleanOrigin);

    if (isLocal || isGreenpreneurDomain || allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    console.error('Blocked by CORS:', cleanOrigin);
    return callback(new Error('CORS policy error'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204,
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiter – 200 requests per 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
}));

// ── Nodemailer Transporter (Zoho SMTP) ────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_HOST || 'smtp.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_APP_PASSWORD,
  },
});

// ── Email Template Helper ─────────────────────────────────────────────────────
const getEmailWrapper = (title, contentHtml) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F5; color: #2A3530; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; background-color: #F4F6F5; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(11, 91, 62, 0.05); }
        .header { background-color: #0B5B3E; padding: 40px; text-align: center; border-bottom: 4px solid #B38728; }
        .header h1 { margin: 0; color: #ffffff; font-size: 26px; letter-spacing: 1.5px; font-weight: 700; text-transform: uppercase; }
        .header p { margin: 8px 0 0 0; color: #E2C073; font-size: 13px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600; }
        .content { padding: 45px 40px; line-height: 1.7; font-size: 15px; }
        .greeting { font-size: 18px; font-weight: 700; color: #0B5B3E; margin-top: 0; margin-bottom: 20px; }
        .highlight-box { background-color: #FDFBF7; border-left: 4px solid #B38728; border-top: 1px solid #F1ECE2; border-right: 1px solid #F1ECE2; border-bottom: 1px solid #F1ECE2; padding: 24px; margin: 30px 0; border-radius: 0 8px 8px 0; }
        .highlight-box table { width: 100%; border-collapse: collapse; }
        .highlight-box td { padding: 6px 0; vertical-align: top; font-size: 14px; }
        .highlight-box td.label { font-weight: 700; color: #0B5B3E; width: 130px; }
        .highlight-box td.value { color: #2A3530; }
        .btn-container { text-align: center; margin: 35px 0 20px 0; }
        .btn { display: inline-block; background-color: #B38728; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; }
        .footer { background-color: #F8FAF8; padding: 30px 40px; text-align: center; border-top: 1px solid #E2E8F0; }
        .footer p { margin: 0; color: #718096; font-size: 12px; line-height: 1.6; }
        .footer a { color: #0B5B3E; text-decoration: none; font-weight: 600; }
        .badge { display: inline-block; background-color: #0B5B3E; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 6px 16px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
        .badge.winner { background-color: #B38728; }
        @media only screen and (max-width: 600px) {
          .wrapper { padding: 10px 0; } .container { border-radius: 8px; border: none; }
          .header { padding: 30px 20px; } .header h1 { font-size: 22px; }
          .content { padding: 30px 20px; } .highlight-box { padding: 16px; }
          .highlight-box td.label { width: 100px; font-size: 13px; } .highlight-box td.value { font-size: 13px; }
          .footer { padding: 25px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Greenpreneur</h1>
            <p>Awards &amp; Conclave 2026</p>
          </div>
          <div class="content">
            ${contentHtml}
          </div>
          <div class="footer">
            <p>Empowering and celebrating sustainable enterprise leaders.</p>
            <p style="margin-top: 10px;">&copy; 2026 <a href="https://greenpreneur.in">Greenpreneur Secretariat</a>. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/nominations',  nominationsRouter);
app.use('/api/events',       eventRouter);
app.use('/api/sponsorships', sponsorshipRouter);
app.use('/api/coffee-book',  coffeeBookRouter);
app.use('/api/contact',      contactRouter);
app.use('/api/community',    communityRouter);
app.use('/api/winners',      winnersRouter);
app.use('/api/payment',      paymentRouter);
app.use('/api/inquiries',    inquiriesRouter);
app.use('/api/admin',        adminRouter);
app.use('/api/blogs',        blogsRouter);
app.use('/api/voice-videos', voiceVideosRouter);

// ── Email Routes (merged from root server.js) ─────────────────────────────────

// 1. Nomination Confirmation Email
app.post('/api/send-nomination', async (req, res) => {
  try {
    const { track, category, nomineeName, companyName, email, phone, website, votingUrl } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const trackLabel = track === 'honorary' ? 'Honorary Award (Free)' : 'Rated Award Challenge';
    let votingSection = votingUrl
      ? `<p>Your official voting profile is now live! Share this link with your network to collect endorsements:</p><div class="btn-container"><a href="${votingUrl}" class="btn" style="color:#ffffff;">View Voting Profile</a></div>`
      : `<div class="btn-container"><a href="https://greenpreneur.in" class="btn" style="color:#ffffff;">Visit Website</a></div>`;

    const htmlContent = getEmailWrapper('Nomination Received', `
      <div class="badge">Nomination Confirmed</div>
      <p class="greeting">Dear ${nomineeName},</p>
      <p>Congratulations! We are thrilled to confirm that your nomination for the <strong>Greenpreneur Awards 2026</strong> has been successfully received.</p>
      <div class="highlight-box"><table>
        <tr><td class="label">Nominee</td><td class="value">${nomineeName}</td></tr>
        <tr><td class="label">Company</td><td class="value">${companyName || 'N/A'}</td></tr>
        <tr><td class="label">Award Track</td><td class="value">${trackLabel}</td></tr>
        <tr><td class="label">Category</td><td class="value">${category || 'General'}</td></tr>
      </table></div>
      <p>Our expert panel will begin the vetting process. We will reach out within 48 hours via email or WhatsApp.</p>
      ${votingSection}
    `);

    await transporter.sendMail({
      from: `Greenpreneur <${process.env.ZOHO_EMAIL}>`,
      to: email.trim(),
      subject: 'Nomination Received - Greenpreneur Awards 2026',
      html: htmlContent,
    });
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending nomination email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// 2. Nomination Approved Email
app.post('/api/send-approval', async (req, res) => {
  try {
    const { email, nomineeName, companyName, category, votingUrl } = req.body;
    if (!email || !nomineeName || !category) return res.status(400).json({ error: 'Email, nomineeName, and category are required' });

    const htmlContent = getEmailWrapper('Nomination Approved', `
      <div class="badge">Nomination Approved</div>
      <p class="greeting">Dear ${nomineeName},</p>
      <p>We are delighted to inform you that your nomination for the <strong>Greenpreneur Awards 2026</strong> has been <strong>Approved</strong> by the steering committee.</p>
      <div class="highlight-box"><table>
        <tr><td class="label">Nominee</td><td class="value">${nomineeName}</td></tr>
        <tr><td class="label">Company</td><td class="value">${companyName || 'N/A'}</td></tr>
        <tr><td class="label">Category</td><td class="value">${category}</td></tr>
      </table></div>
      <p>Public endorsement accounts for 25% of the overall evaluation. Share your voting page:</p>
      <div class="btn-container"><a href="${votingUrl}" class="btn" style="color:#ffffff;">View Voting Page</a></div>
      <p>Our team will contact you soon with conclave and delegate scheduling details.</p>
    `);

    await transporter.sendMail({
      from: `Greenpreneur <${process.env.ZOHO_EMAIL}>`,
      to: email.trim(),
      subject: 'Nomination Approved & Voting Live - Greenpreneur Awards 2026',
      html: htmlContent,
    });
    res.status(200).json({ message: 'Approval email sent successfully!' });
  } catch (error) {
    console.error('Error sending approval email:', error);
    res.status(500).json({ error: 'Failed to send approval email' });
  }
});

// 3. Winner Congratulations Email
app.post('/api/send-winner-email', async (req, res) => {
  try {
    const { email, nomineeName, companyName, category, votingUrl } = req.body;
    if (!email || !nomineeName || !category) return res.status(400).json({ error: 'Email, nomineeName, and category are required' });

    const htmlContent = getEmailWrapper('Winner Announcement', `
      <div class="badge winner">🏆 Winner Announcement</div>
      <p class="greeting">Dear ${nomineeName},</p>
      <p>It is our distinct privilege to congratulate you! You have been selected as an official <strong>Winner</strong> of the prestigious <strong>Greenpreneur Awards 2026</strong> under the category:</p>
      <p style="font-size:16px;font-weight:bold;color:#B38728;text-align:center;margin:20px 0;">${category}</p>
      <div class="highlight-box"><table>
        <tr><td class="label">Recipient</td><td class="value">${nomineeName}</td></tr>
        <tr><td class="label">Company</td><td class="value">${companyName || 'N/A'}</td></tr>
        <tr><td class="label">Award Title</td><td class="value">${category}</td></tr>
        <tr><td class="label">Award Year</td><td class="value">2026</td></tr>
      </table></div>
      <p>Your winner showcase profile is now live in the Hall of Fame:</p>
      <div class="btn-container"><a href="${votingUrl}" class="btn" style="color:#ffffff;">View Winner Profile</a></div>
      <p>Our secretariat will reach out via WhatsApp or phone with details regarding the awards conclave ceremony.</p>
    `);

    await transporter.sendMail({
      from: `Greenpreneur <${process.env.ZOHO_EMAIL}>`,
      to: email.trim(),
      subject: '🏆 Congratulations! You are a Greenpreneur 2026 Winner!',
      html: htmlContent,
    });
    res.status(200).json({ message: 'Winner email sent successfully!' });
  } catch (error) {
    console.error('Error sending winner email:', error);
    res.status(500).json({ error: 'Failed to send winner email' });
  }
});

// 4. General Confirmation Email (Inquiries, Events, Sponsorships, Community, etc.)
app.post('/api/send-confirmation', async (req, res) => {
  try {
    const { email, name, type, details } = req.body;
    if (!email || !name || !type) return res.status(400).json({ error: 'Email, name, and type are required' });

    const detailRows = Object.entries(details || {})
      .map(([key, value]) => `<tr><td class="label">${key}</td><td class="value">${value || 'N/A'}</td></tr>`)
      .join('');

    const htmlContent = getEmailWrapper('Submission Received', `
      <div class="badge">Confirmation</div>
      <p class="greeting">Dear ${name},</p>
      <p>Thank you for submitting your details. We have successfully received your inquiry / application for <strong>${type}</strong>.</p>
      <div class="highlight-box"><table>
        <tr><td class="label">Submitted By</td><td class="value">${name}</td></tr>
        <tr><td class="label">Form Type</td><td class="value">${type}</td></tr>
        ${detailRows}
      </table></div>
      <p>Our secretariat desk is reviewing your submission. A representative will contact you within 24 to 48 business hours.</p>
      <div class="btn-container"><a href="https://greenpreneur.in" class="btn" style="color:#ffffff;">Visit Website</a></div>
    `);

    await transporter.sendMail({
      from: `Greenpreneur <${process.env.ZOHO_EMAIL}>`,
      to: email.trim(),
      subject: `Application Confirmation - ${type}`,
      html: htmlContent,
    });
    res.status(200).json({ message: 'Confirmation email sent successfully!' });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

// ── Static File Serving (React build) ────────────────────────────────────────
// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve React frontend build (dist folder at project root)
const distPath = path.join(__dirname, '..', '..', 'dist');
app.use(express.static(distPath));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Greenpreneur API is running', timestamp: new Date() });
});

// All other routes → serve React app (for client-side routing)
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Greenpreneur Unified Server running on port ${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log(`   Frontend: http://localhost:${PORT}`);
});

export default app;
// Trigger dev api restart - run now port freed
