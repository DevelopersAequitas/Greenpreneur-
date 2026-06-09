import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function sendTestEmail() {
  try {
    console.log('Connecting to', process.env.ZOHO_HOST, 'with', process.env.ZOHO_EMAIL);
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_HOST || 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_APP_PASSWORD,
      },
    });

    const nomineeName = "Hardik";
    const companyName = "Greenpreneur Test";
    const track = "honorary";
    const category = "Test Category";

    const mailOptions = {
      from: `Greenpreneur <${process.env.ZOHO_EMAIL}>`,
      to: 'hardikpparmar1116@gmail.com',
      subject: 'Nomination Received - Greenpreneur Awards 2026',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FDFBF7; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #eaeaea; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            .header { background-color: #0B5B3E; padding: 35px 40px; text-align: center; border-bottom: 4px solid #B38728; }
            .header h1 { margin: 0; color: #ffffff; font-size: 28px; letter-spacing: 1px; font-weight: 700; word-break: break-word; }
            .header p { margin: 10px 0 0 0; color: #E5E7EB; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; }
            .content { padding: 40px; color: #333333; line-height: 1.6; }
            .greeting { font-size: 20px; font-weight: bold; color: #0C1B33; margin-top: 0; }
            .highlight-box { background-color: #F8FAF9; border-left: 4px solid #B38728; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0; }
            .highlight-box p { margin: 0 0 10px 0; font-size: 14px; }
            .highlight-box p:last-child { margin: 0; }
            .highlight-box strong { color: #0B5B3E; display: inline-block; width: 100px; }
            .btn { display: inline-block; background-color: #B38728; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; }
            .footer { background-color: #F9FAFB; padding: 30px 40px; text-align: center; border-top: 1px solid #eaeaea; }
            .footer p { margin: 0; color: #6B7280; font-size: 13px; line-height: 1.5; }
            .footer a { color: #0B5B3E; text-decoration: none; font-weight: bold; }

            @media only screen and (max-width: 600px) {
              .container { margin: 10px; border-radius: 8px; }
              .header { padding: 25px 20px !important; }
              .header h1 { font-size: 24px !important; letter-spacing: 0px; }
              .header p { font-size: 12px !important; letter-spacing: 2px; }
              .content { padding: 25px 20px !important; }
              .highlight-box { padding: 15px !important; margin: 20px 0 !important; }
              .footer { padding: 25px 20px !important; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Greenpreneur</h1>
              <p>Awards & Conclave 2026</p>
            </div>
            
            <div class="content">
              <p class="greeting">Dear ${nomineeName},</p>
              
              <p>Congratulations! We are absolutely thrilled to confirm that your nomination for the <strong>Greenpreneur Awards 2026</strong> has been successfully received by our secretariat.</p>
              
              <div class="highlight-box">
                <p><strong>Nominee:</strong> ${nomineeName}</p>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Track:</strong> ${track === 'honorary' ? 'Honorary Award' : 'Rated Award Challenge'}</p>
                <p><strong>Category:</strong> ${category || 'N/A'}</p>
              </div>

              <p>Our expert panel and jury will now begin the initial vetting process. We meticulously review all entries to ensure they align with our core values of sustainability, innovation, and impact.</p>
              
              <p>Our team will reach out to you within the next 48 hours via email or WhatsApp regarding the next steps, including verification credentials and any required creatives.</p>
              
              <center>
                <a href="https://greenpreneur.in" class="btn">Visit Website</a>
              </center>
            </div>
            
            <div class="footer">
              <p>Thank you for championing a greener future.</p>
              <p style="margin-top: 15px;">&copy; 2026 <a href="https://greenpreneur.in">Greenpreneur Secretariat</a>. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Premium test email sent successfully! Message ID:', info.messageId);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

sendTestEmail();
