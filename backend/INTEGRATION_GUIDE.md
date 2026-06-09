# Greenpreneur — MySQL Database & Backend Integration Guide

## What's Included

```
Greenpreneur_Database.sql     ← Run this in MySQL first
backend/
  server.js                   ← Express API server entry point
  package.json                ← Backend dependencies
  .env.example                ← Copy to .env and fill credentials
  config/
    db.js                     ← MySQL connection pool
  routes/
    nominations.js            ← POST /api/nominations, GET /api/nominations/categories
    events.js                 ← POST /api/events/register
    sponsorships.js           ← POST /api/sponsorships
    coffeeBook.js             ← POST /api/coffee-book
    contact.js                ← POST /api/contact
    community.js              ← POST /api/community/apply
    winners.js                ← GET /api/winners
    otherRoutes.js            ← Shared route implementations
src/utils/
  api.ts                      ← Drop this into your React src/utils/ folder
```

---

## Step 1 — Set Up the MySQL Database

1. Open your MySQL client (MySQL Workbench, TablePlus, or CLI).
2. Run the SQL file:

```sql
SOURCE /path/to/Greenpreneur_Database.sql;
```

Or via CLI:
```bash
mysql -u root -p < Greenpreneur_Database.sql
```

This creates:

| Table | Purpose |
|---|---|
| `award_categories` | 45 master award categories (pre-seeded) |
| `nominations` | All award applications from the wizard |
| `winners` | Past/current winners displayed on Winners page |
| `event_registrations` | Greenpreneur 2026 event pass signups |
| `sponsorships` | Corporate sponsor enquiries |
| `coffee_table_book_orders` | Book feature/ad slot bookings |
| `contact_enquiries` | General contact form messages |
| `community_applications` | Peers Global membership applications |
| `admin_users` | Secretariat admin accounts |
| `audit_log` | Change tracking for all records |

And views: `v_nominations_summary`, `v_sponsorship_pipeline`, `v_revenue_summary`.

---

## Step 2 — Set Up the Backend Server

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run dev
```

The API will run at `http://localhost:5000`.

---

## Step 3 — Connect the React Frontend

### 3a. Add environment variable to your Vite project

Create or edit `Grenpreneur New/.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

For production:
```
VITE_API_URL=https://your-api-domain.com/api
```

### 3b. Copy the API utility

Copy `src/utils/api.ts` into `Grenpreneur New/src/utils/api.ts`.

### 3c. Wire up each page

---

#### ApplyAward.tsx — Replace `handleSubmit`

```tsx
import { submitNomination } from '../utils/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateStep(currentStep)) return;
  try {
    await submitNomination({
      track,
      name: formData.name,
      business: formData.business,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      category: formData.category,
      description: formData.description,
      link: formData.link,
      package: track === 'rated' ? formData.package : undefined,
    });
    setSubmitted(true);
  } catch (err: any) {
    alert(err.message || 'Submission failed. Please try again.');
  }
};
```

---

#### Event2026.tsx — Replace `handleSubmit`

```tsx
import { registerForEvent } from '../utils/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.email || !formData.phone) return;
  try {
    await registerForEvent(formData);
    setRegistered(true);
  } catch (err: any) {
    alert(err.message || 'Registration failed. Please try again.');
  }
};
```

---

#### Sponsorship.tsx — Replace `handleSubmit`

```tsx
import { submitSponsorshipEnquiry } from '../utils/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.company || !formData.email || !formData.phone) return;
  try {
    await submitSponsorshipEnquiry(formData);
    setSubmitted(true);
  } catch (err: any) {
    alert(err.message || 'Submission failed. Please try again.');
  }
};
```

---

#### CoffeeTableBook.tsx — Replace `handleSubmit`

```tsx
import { submitCoffeeBookEnquiry } from '../utils/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.phone || !formData.email || !formData.company) return;
  try {
    await submitCoffeeBookEnquiry(formData);
    setSubmitted(true);
  } catch (err: any) {
    alert(err.message || 'Submission failed. Please try again.');
  }
};
```

---

#### Contact.tsx — Replace `handleSubmit`

```tsx
import { submitContactEnquiry } from '../utils/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.phone || !formData.email) return;
  try {
    await submitContactEnquiry(formData);
    setSubmitted(true);
  } catch (err: any) {
    alert(err.message || 'Failed to send message. Please try again.');
  }
};
```

---

#### Community.tsx — Replace `handleSubmit`

```tsx
import { submitCommunityApplication } from '../utils/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await submitCommunityApplication({
      ...formData,
      whyJoin: formData.whyJoin,
    });
    setSubmitted(true);
  } catch (err: any) {
    alert(err.message || 'Application failed. Please try again.');
  }
};
```

---

#### Winners.tsx — Load from database

```tsx
import { useEffect } from 'react';
import { getWinners, Winner } from '../utils/api';

// Replace the static winnersData array with a useEffect:
const [winnersData, setWinnersData] = useState<Winner[]>([]);

useEffect(() => {
  getWinners().then(res => {
    if (res.success && res.data) setWinnersData(res.data);
  });
}, []);
```

---

## API Endpoints Reference

| Method | Endpoint | Page | Description |
|---|---|---|---|
| POST | `/api/nominations` | ApplyAward | Submit nomination |
| GET | `/api/nominations/categories` | ApplyAward | List categories |
| GET | `/api/nominations/:id` | — | Check status |
| POST | `/api/events/register` | Event2026 | Register for event |
| POST | `/api/sponsorships` | Sponsorship | Sponsor enquiry |
| POST | `/api/coffee-book` | CoffeeTableBook | Book enquiry |
| POST | `/api/contact` | Contact | General enquiry |
| POST | `/api/community/apply` | Community | Membership apply |
| GET | `/api/winners` | Winners | List winners |
| GET | `/api/health` | — | Health check |

---

## Nomination Status Flow

```
pending → vetting → approved → winner
                 ↘ rejected
```

For rated nominations, payment flow runs in parallel:
```
not_applicable (honorary)
pending → paid (rated)
       ↘ failed
```

---

## Security Notes

- **Change the default admin password** in `admin_users` immediately after setup.
- Use HTTPS in production for all API calls.
- Set `FRONTEND_URL` in `.env` to your actual domain to lock CORS.
- The rate limiter is set to 100 requests/15 min per IP — tighten for production.
- All form inputs are validated server-side in every route.
