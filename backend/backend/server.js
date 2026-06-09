// =============================================================================
// Greenpreneur Backend API Server
// Stack: Node.js + Express + MySQL2
// =============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Middleware ─────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isLocal = origin.startsWith('http://localhost') || 
                    origin.startsWith('http://127.0.0.1') || 
                    /^http:\/\/(?:192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?::\d+)?$/.test(origin);
    if (isLocal || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy error'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));

// Global rate limiter – 100 requests per 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
}));

// ── Routes ───────────────────────────────────────────────────────────────────
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

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Greenpreneur API is running', timestamp: new Date() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅  Greenpreneur API running on port ${PORT}`);
});

export default app;
