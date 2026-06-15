import pool from './config/db.js';

const speakersData = [
  {
    name: 'Achal Rangaswamy',
    role: 'Business Coach & Author',
    org: 'Peers Global',
    tags: ['Coach', 'Author', 'Speaker'],
    photo_url: '/uploads/nominations/Achal Rangaswamy.png',
    bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
  },
  {
    name: 'Aditya Jhunjhunwala',
    role: 'Co-Founder, ADMC & Business Coach',
    org: 'ADMC',
    tags: ['Coach', 'Speaker'],
    photo_url: '/uploads/nominations/Aditya Jhunjhunwala.png',
    bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
  },
  {
    name: 'Ajay Thakur',
    role: 'CEO & Managing Partner',
    org: 'TGI SME Capital Advisors LLP',
    tags: ['Finance', 'Speaker'],
    photo_url: '/uploads/nominations/Ajay Thakur.png',
    bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
  },
  {
    name: 'Binjan Sheth',
    role: 'Founder, Coding and More & Director',
    org: 'Thinkgreen Envirotech Pvt Ltd',
    tags: ['Envirotech', 'Education', 'Speaker'],
    photo_url: '/uploads/nominations/Binjan Sheth.png',
    bg_gradient: 'linear-gradient(160deg,#5a8a70,#3a6a52)'
  },
  {
    name: 'CA Shubham Maloo',
    role: 'Chartered Accountant & Founder',
    org: 'Shubham Maloo & Co.',
    tags: ['Finance', 'Consultant', 'Speaker'],
    photo_url: '/uploads/nominations/CA Shubham Maloo.png',
    bg_gradient: 'linear-gradient(160deg,#2a3a7a,#1a2a6a)'
  },
  {
    name: 'Chandrakant Salunkhe',
    role: 'Founder & President',
    org: 'SME Chamber of India',
    tags: ['SME Leader', 'President', 'Speaker'],
    photo_url: '/uploads/nominations/Chandrakant Salunkhe.png',
    bg_gradient: 'linear-gradient(160deg,#8a3a9a,#5a1a7a)'
  },
  {
    name: 'Dr Parimal Merchant',
    role: 'Director, Global FMB Program',
    org: 'SP Jain School of Global Management',
    tags: ['Academician', 'Director', 'Speaker'],
    photo_url: '/uploads/nominations/Dr Parimal Merchant.png',
    bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
  },
  {
    name: 'Dr. Krishna Singh Arya',
    role: 'SDG Champion, Mentor & Academician',
    org: 'World Leader Summit',
    tags: ['SDG Champion', 'Mentor', 'Speaker'],
    photo_url: '/uploads/nominations/Dr. Krishna Singh Arya.png',
    bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
  },
  {
    name: 'Jagdish Vishwakarma',
    role: 'MoS for MSME, Cooperation & Cottage Industries',
    org: 'Government of Gujarat',
    tags: ['Minister', 'MSME Leader', 'Speaker'],
    photo_url: '/uploads/nominations/Jagdish Vishwakarma.png',
    bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
  },
  {
    name: 'Kuldipsingh Kaler',
    role: 'Creative Head – Marketing',
    org: 'Tea Post',
    tags: ['Marketing', 'Influencer', 'Speaker'],
    photo_url: '/uploads/nominations/Kuldipsingh Kaler.png',
    bg_gradient: 'linear-gradient(160deg,#5a8a70,#3a6a52)'
  },
  {
    name: 'Madhu Menon',
    role: 'Director, Anala Outdoors & Sattva Vikas School',
    org: 'Anala Outdoors',
    tags: ['Biodiversity', 'Director', 'Speaker'],
    photo_url: '/uploads/nominations/Madhu Menon.png',
    bg_gradient: 'linear-gradient(160deg,#2a3a7a,#1a2a6a)'
  },
  {
    name: 'Moloy Chakravorty',
    role: 'Founder & Managing Director',
    org: 'Beyond Red Ocean Consulting',
    tags: ['Coach', 'Consultant', 'Speaker'],
    photo_url: '/uploads/nominations/Moloy Chakravorty.png',
    bg_gradient: 'linear-gradient(160deg,#8a3a9a,#5a1a7a)'
  },
  {
    name: 'Nayan Mehta',
    role: 'Chief Financial Officer',
    org: 'BSE (Bombay Stock Exchange) Limited',
    tags: ['Finance', 'CFO', 'Speaker'],
    photo_url: '/uploads/nominations/Nayan Mehta.png',
    bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
  },
  {
    name: 'Pabiben Rabari',
    role: 'Founder',
    org: 'Pabiben.com',
    tags: ['Artisan', 'Entrepreneur', 'Speaker'],
    photo_url: '/uploads/nominations/Pabiben Rabari.png',
    bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
  },
  {
    name: 'R. Gopinath Rao',
    role: 'IEDS, Deputy Director, MSME Development Institute',
    org: 'Government of India',
    tags: ['Government', 'MSME Director', 'Speaker'],
    photo_url: '/uploads/nominations/R. Gopinath Rao.png',
    bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
  },
  {
    name: 'Ramkumar Seshu',
    role: 'Business Coach, Mentor & Founder',
    org: 'Seshu Consulting',
    tags: ['Coach', 'Mentor', 'Speaker'],
    photo_url: '/uploads/nominations/Ramkumar Seshu.png',
    bg_gradient: 'linear-gradient(160deg,#5a8a70,#3a6a52)'
  },
  {
    name: 'Shiv Khera',
    role: 'Author, Educator & Motivational Speaker',
    org: 'Qualified Learning Systems',
    tags: ['Author', 'Speaker', 'Jury'],
    photo_url: '/uploads/nominations/Shiv Khera.png',
    bg_gradient: 'linear-gradient(160deg,#2a3a7a,#1a2a6a)'
  },
  {
    name: 'Shraddha Musale',
    role: 'Founder, FutureTayari / Actor & Presence Coach',
    org: 'FutureTayari',
    tags: ['Founder', 'Actor', 'Coach', 'Speaker'],
    photo_url: '/uploads/nominations/Shraddha Musale.png',
    bg_gradient: 'linear-gradient(160deg,#8a3a9a,#5a1a7a)'
  },
  {
    name: 'Suresh Mansharamani',
    role: 'Founder, Tajurba Business Network & OKR Expert',
    org: 'Tajurba Business Network',
    tags: ['Coach', 'Founder', 'Speaker', 'Jury'],
    photo_url: '/uploads/nominations/Suresh Mansharamani.png',
    bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
  },
  {
    name: 'Tanvvi Rathod',
    role: 'Founder, Maisson By Tanvvi Rathod / Mentorship Expert',
    org: 'Maisson By Tanvvi Rathod',
    tags: ['Mentor', 'Trainer', 'Speaker'],
    photo_url: '/uploads/nominations/Tanvvi Rathod.png',
    bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
  },
  {
    name: 'Vijay Kalantri',
    role: 'President, AIAI & Chairman',
    org: 'MVIRDC World Trade Center Mumbai',
    tags: ['Industry Leader', 'President', 'Speaker'],
    photo_url: '/uploads/nominations/Vijay  Kalantri.png',
    bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
  },
  {
    name: 'Sanjay Raval',
    role: 'Author, Motivational Speaker & Entrepreneur',
    org: 'Sanjay Raval Seminars',
    tags: ['Author', 'Speaker', 'Entrepreneur'],
    photo_url: '/uploads/nominations/sanjay raval.png',
    bg_gradient: 'linear-gradient(160deg,#5a8a70,#3a6a52)'
  }
];

async function insertSpeakers() {
  try {
    console.log('Inserting 22 speakers into jury table...');
    for (const s of speakersData) {
      // Check if speaker already exists by name
      const [existing] = await pool.query('SELECT id FROM jury WHERE name = ?', [s.name]);
      if (existing.length > 0) {
        console.log(`Speaker "${s.name}" already exists, skipping...`);
        continue;
      }

      await pool.query(
        'INSERT INTO jury (name, role, org, tags, photo_url, bg_gradient, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [s.name, s.role, s.org, JSON.stringify(s.tags), s.photo_url, s.bg_gradient]
      );
      console.log(`\u2705 Inserted: ${s.name}`);
    }
    console.log('\u001b[32m\u200b\u2705 Insertion finished successfully!\u001b[0m');
    process.exit(0);
  } catch (error) {
    console.error('\u274c Insertion failed:', error);
    process.exit(1);
  }
}

insertSpeakers();
