import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.EMAIL_SERVICE_PORT || 3000;

app.use(cors());
app.use(express.json());

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_HOST || 'smtp.zoho.in',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_APP_PASSWORD,
  },
});

/**
 * Helper to wrap email content in a premium, responsive Greenpreneur template.
 */
const getEmailWrapper = (title, contentHtml) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
          background-color: #F4F6F5; 
          color: #2A3530;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #F4F6F5;
          padding: 40px 0;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #ffffff; 
          border-radius: 12px; 
          overflow: hidden; 
          border: 1px solid #E2E8F0; 
          box-shadow: 0 4px 12px rgba(11, 91, 62, 0.05); 
        }
        .header { 
          background-color: #0B5B3E; 
          padding: 40px; 
          text-align: center; 
          border-bottom: 4px solid #B38728; 
        }
        .header h1 { 
          margin: 0; 
          color: #ffffff; 
          font-size: 26px; 
          letter-spacing: 1.5px; 
          font-weight: 700; 
          text-transform: uppercase;
        }
        .header p { 
          margin: 8px 0 0 0; 
          color: #E2C073; 
          font-size: 13px; 
          text-transform: uppercase; 
          letter-spacing: 3px; 
          font-weight: 600;
        }
        .content { 
          padding: 45px 40px; 
          line-height: 1.7; 
          font-size: 15px;
        }
        .greeting { 
          font-size: 18px; 
          font-weight: 700; 
          color: #0B5B3E; 
          margin-top: 0;
          margin-bottom: 20px;
        }
        .highlight-box { 
          background-color: #FDFBF7; 
          border-left: 4px solid #B38728; 
          border-top: 1px solid #F1ECE2;
          border-right: 1px solid #F1ECE2;
          border-bottom: 1px solid #F1ECE2;
          padding: 24px; 
          margin: 30px 0; 
          border-radius: 0 8px 8px 0; 
        }
        .highlight-box table {
          width: 100%;
          border-collapse: collapse;
        }
        .highlight-box td {
          padding: 6px 0;
          vertical-align: top;
          font-size: 14px;
        }
        .highlight-box td.label {
          font-weight: 700;
          color: #0B5B3E;
          width: 130px;
        }
        .highlight-box td.value {
          color: #2A3530;
        }
        .btn-container {
          text-align: center;
          margin: 35px 0 20px 0;
        }
        .btn { 
          display: inline-block; 
          background-color: #B38728; 
          color: #ffffff !important; 
          text-decoration: none; 
          padding: 14px 32px; 
          border-radius: 8px; 
          font-weight: 700; 
          font-size: 13px; 
          text-transform: uppercase; 
          letter-spacing: 1.5px; 
          transition: background-color 0.2s;
        }
        .footer { 
          background-color: #F8FAF8; 
          padding: 30px 40px; 
          text-align: center; 
          border-top: 1px solid #E2E8F0; 
        }
        .footer p { 
          margin: 0; 
          color: #718096; 
          font-size: 12px; 
          line-height: 1.6; 
        }
        .footer a { 
          color: #0B5B3E; 
          text-decoration: none; 
          font-weight: 600; 
        }
        .badge {
          display: inline-block;
          background-color: #0B5B3E;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }
        .badge.winner {
          background-color: #B38728;
        }
        @media only screen and (max-width: 600px) {
          .wrapper { padding: 10px 0; }
          .container { border-radius: 8px; border: none; }
          .header { padding: 30px 20px; }
          .header h1 { font-size: 22px; }
          .content { padding: 30px 20px; }
          .highlight-box { padding: 16px; }
          .highlight-box td.label { width: 100px; font-size: 13px; }
          .highlight-box td.value { font-size: 13px; }
          .footer { padding: 25px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Greenpreneur</h1>
            <p>Awards & Conclave 2026</p>
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

// 1. Nomination Confirmation Email Endpoint
app.post('/api/send-nomination', async (req, res) => {
  try {
    const { 
      track, 
      category, 
      nomineeName, 
      companyName, 
      email, 
      phone, 
      website,
      votingUrl 
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const trackLabel = track === 'honorary' ? 'Honorary Award (Free)' : 'Rated Award Challenge';
    
    let votingSection = '';
    if (votingUrl) {
      votingSection = `
        <p>Your official voting profile is now live! You can start sharing this link with your professional network, peers, and customers to collect endorsements:</p>
        <div class="btn-container">
          <a href="${votingUrl}" class="btn" style="color: #ffffff;">View Voting Profile</a>
        </div>
      `;
    } else {
      votingSection = `
        <div class="btn-container">
          <a href="https://greenpreneur.in" class="btn" style="color: #ffffff;">Visit Website</a>
        </div>
      `;
    }

    const htmlContent = getEmailWrapper(
      'Nomination Received',
      `
      <div class="badge">Nomination Confirmed</div>
      <p class="greeting">Dear ${nomineeName},</p>
      
      <p>Congratulations! We are absolutely thrilled to confirm that your nomination for the <strong>Greenpreneur Awards 2026</strong> has been successfully received and registered by our secretariat.</p>
      
      <div class="highlight-box">
        <table>
          <tr>
            <td class="label">Nominee</td>
            <td class="value">${nomineeName}</td>
          </tr>
          <tr>
            <td class="label">Company</td>
            <td class="value">${companyName || 'N/A'}</td>
          </tr>
          <tr>
            <td class="label">Award Track</td>
            <td class="value">${trackLabel}</td>
          </tr>
          <tr>
            <td class="label">Category</td>
            <td class="value">${category || 'General'}</td>
          </tr>
        </table>
      </div>

      <p>Our expert panel and jury will now begin the vetting process. We meticulously review all entries to ensure they align with our core metrics of sustainability, green innovation, and circular economic impact.</p>
      
      ${votingSection}
      
      <p>Our steering team will reach out to you within the next 48 hours via email or WhatsApp regarding any verification requirements or promotional creative kits.</p>
      `
    );

    const mailOptions = {
      from: `Greenpreneur <${process.env.ZOHO_EMAIL}>`,
      to: email.trim(),
      subject: 'Nomination Received - Greenpreneur Awards 2026',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please check your SMTP configuration.' });
  }
});

// 2. Nomination Approved Email Endpoint
app.post('/api/send-approval', async (req, res) => {
  try {
    const { email, nomineeName, companyName, category, votingUrl } = req.body;

    if (!email || !nomineeName || !category) {
      return res.status(400).json({ error: 'Email, nomineeName, and category are required' });
    }

    const htmlContent = getEmailWrapper(
      'Nomination Approved',
      `
      <div class="badge">Nomination Approved</div>
      <p class="greeting">Dear ${nomineeName},</p>
      
      <p>We are delighted to inform you that your nomination for the <strong>Greenpreneur Awards 2026</strong> has been formally reviewed and <strong>Approved</strong> by the steering committee.</p>
      
      <p>Your profile has successfully cleared our screening stage and is now active for public voting and final jury assessment.</p>
      
      <div class="highlight-box">
        <table>
          <tr>
            <td class="label">Nominee</td>
            <td class="value">${nomineeName}</td>
          </tr>
          <tr>
            <td class="label">Company</td>
            <td class="value">${companyName || 'N/A'}</td>
          </tr>
          <tr>
            <td class="label">Category</td>
            <td class="value">${category}</td>
          </tr>
        </table>
      </div>

      <p>Public endorsement accounts for 25% of the overall evaluation weight for Rated Track awards. We encourage you to share your official voting page with your professional community to collect votes:</p>
      
      <div class="btn-container">
        <a href="${votingUrl}" class="btn" style="color: #ffffff;">View Voting Page</a>
      </div>
      
      <p>We wish you the absolute best in the upcoming challenge. Our team will contact you soon with updates regarding conclave tickets and delegate scheduling.</p>
      `
    );

    const mailOptions = {
      from: `Greenpreneur <${process.env.ZOHO_EMAIL}>`,
      to: email.trim(),
      subject: 'Nomination Approved & Voting Live - Greenpreneur Awards 2026',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Approval email sent successfully!' });
  } catch (error) {
    console.error('Error sending approval email:', error);
    res.status(500).json({ error: 'Failed to send approval email' });
  }
});

// 3. Winner Congratulations Email Endpoint
app.post('/api/send-winner-email', async (req, res) => {
  try {
    const { email, nomineeName, companyName, category, votingUrl } = req.body;

    if (!email || !nomineeName || !category) {
      return res.status(400).json({ error: 'Email, nomineeName, and category are required' });
    }

    const htmlContent = getEmailWrapper(
      'Winner Announcement',
      `
      <div class="badge winner">🏆 Winner Announcement</div>
      <p class="greeting">Dear ${nomineeName},</p>
      
      <p>It is our distinct privilege to congratulate you! We are absolutely thrilled to inform you that you have been selected as an official <strong>Winner</strong> of the prestigious <strong>Greenpreneur Awards 2026</strong> under the category:</p>
      
      <p style="font-size: 16px; font-weight: bold; color: #B38728; text-align: center; margin: 20px 0;">
        ${category}
      </p>
      
      <div class="highlight-box">
        <table>
          <tr>
            <td class="label">Recipient</td>
            <td class="value">${nomineeName}</td>
          </tr>
          <tr>
            <td class="label">Company</td>
            <td class="value">${companyName || 'N/A'}</td>
          </tr>
          <tr>
            <td class="label">Award Title</td>
            <td class="value">${category}</td>
          </tr>
          <tr>
            <td class="label">Award Year</td>
            <td class="value">2026</td>
          </tr>
        </table>
      </div>

      <p>This award recognises your outstanding leadership in sustainability, circular economy models, and circular economic growth. Your initiatives stand as a stellar standard of excellence for green business leaders.</p>
      
      <p>Your official winner showcase profile is now live in the Hall of Fame. You can view it and share this milestone with your network using the button below:</p>
      
      <div class="btn-container">
        <a href="${votingUrl}" class="btn" style="color: #ffffff;">View Winner Profile</a>
      </div>
      
      <p>Our secretariat desk will reach out to you shortly via WhatsApp or phone with details regarding the awards conclave ceremony, delegate invitations, and recipient passes.</p>
      `
    );

    const mailOptions = {
      from: `Greenpreneur <${process.env.ZOHO_EMAIL}>`,
      to: email.trim(),
      subject: '🏆 Congratulations! You are a Greenpreneur 2026 Winner!',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Winner email sent successfully!' });
  } catch (error) {
    console.error('Error sending winner email:', error);
    res.status(500).json({ error: 'Failed to send winner email' });
  }
});

// 4. General Submission Confirmation Email Endpoint (for Inquiries, Events, Sponsorships, etc.)
app.post('/api/send-confirmation', async (req, res) => {
  try {
    const { email, name, type, details } = req.body;

    if (!email || !name || !type) {
      return res.status(400).json({ error: 'Email, name, and type are required' });
    }

    const detailRows = Object.entries(details || {})
      .map(([key, value]) => `
        <tr>
          <td class="label">${key}</td>
          <td class="value">${value || 'N/A'}</td>
        </tr>
      `).join('');

    const htmlContent = getEmailWrapper(
      'Submission Received',
      `
      <div class="badge">Confirmation</div>
      <p class="greeting">Dear ${name},</p>
      
      <p>Thank you for submitting your details. We are pleased to confirm that we have successfully received your inquiry / application for <strong>${type}</strong>.</p>
      
      <div class="highlight-box">
        <table>
          <tr>
            <td class="label">Submitted By</td>
            <td class="value">${name}</td>
          </tr>
          <tr>
            <td class="label">Form Type</td>
            <td class="value">${type}</td>
          </tr>
          ${detailRows}
        </table>
      </div>

      <p>Our secretariat desk is currently reviewing your submission. A representative will contact you within the next 24 to 48 business hours with further instructions and details.</p>
      
      <div class="btn-container">
        <a href="https://greenpreneur.in" class="btn" style="color: #ffffff;">Visit Website</a>
      </div>
      `
    );

    const mailOptions = {
      from: `Greenpreneur <${process.env.ZOHO_EMAIL}>`,
      to: email.trim(),
      subject: `Application Confirmation - ${type}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Confirmation email sent successfully!' });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

// 5. Google Reviews Endpoint
app.get('/api/google-reviews', async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    // If credentials exist, fetch live from Google
    if (apiKey && placeId) {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,user_ratings_total,rating&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const formattedData = {
          aggregate: {
            rating: data.result.rating,
            totalReviews: data.result.user_ratings_total,
            label: data.result.rating >= 4.5 ? "EXCELLENT" : "GREAT"
          },
          reviews: data.result.reviews.map(review => ({
            id: review.time, // Using timestamp as unique ID
            authorName: review.author_name,
            profilePhotoUrl: review.profile_photo_url,
            rating: review.rating,
            relativeTimeDescription: review.relative_time_description,
            text: review.text
          }))
        };
        return res.status(200).json(formattedData);
      } else {
        console.warn('Google API returned non-OK status, falling back to mock data. Status:', data.status);
      }
    }

    // Fallback data if keys are missing or API fails
    const fallbackData = {
      aggregate: {
        rating: 5.0,
        totalReviews: 169,
        label: "EXCELLENT"
      },
      reviews: [
        {
          id: 1,
          authorName: "Alpa's recipe",
          profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjX1aW",
          rating: 5,
          relativeTimeDescription: "4 March 2023",
          text: "Thank u for this wonderful opportunity...to share my journey as a Mompreneur...It was our pleasure..."
        },
        {
          id: 2,
          authorName: "Surabhi Joshi",
          profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjW",
          rating: 5,
          relativeTimeDescription: "18 February 2023",
          text: "Thank you for giving opportunity to share view on such a large platform."
        },
        {
          id: 3,
          authorName: "Dr. Kavita Saxena",
          profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjY",
          rating: 5,
          relativeTimeDescription: "12 February 2023",
          text: "Fempreneur talk show is a great initiative by Vyapaar Jagat and am sure such initiatives will contribute immensely in helping n supporting..."
        },
        {
          id: 4,
          authorName: "Jyotsna Joshi",
          profilePhotoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjZ",
          rating: 5,
          relativeTimeDescription: "12 February 2023",
          text: "It's a really nice experience"
        }
      ]
    };

    res.status(200).json(fallbackData);
  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.listen(PORT, () => {
  console.log(`Email notification service is running on http://localhost:${PORT}`);
});
