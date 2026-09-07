import pool from './config/db.js';

const additionalSpeakers = [
  {
    name: 'Anil Mulchandani',
    role: 'Freelance Writer & Author',
    org: 'CEED / Peers Global',
    tags: ['Writer', 'Author', 'Speaker'],
    photo_url: '/uploads/nominations/Anil Mulchandani.jpg',
    bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
  },
  {
    name: 'Devang Brahmbhatt',
    role: 'BNI Coordinator & Business Owner',
    org: 'Wehear Innovations Pvt Ltd',
    tags: ['Entrepreneur', 'Speaker'],
    photo_url: '/uploads/nominations/Devang Brahmbhatt.jpg',
    bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
  },
  {
    name: 'Dr. Pravin Parmar',
    role: 'Founder & President',
    org: 'VyapaarJagat.com & MEIF',
    tags: ['Founder', 'President', 'Speaker', 'Jury'],
    photo_url: '/uploads/nominations/Dr. Pravin Parmar.jpg',
    bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
  },
  {
    name: 'Dr. Sachin Shigwan',
    role: 'Social Entrepreneur & Founder',
    org: 'Green India Initiative Pvt Ltd',
    tags: ['Solar Tech', 'Rural Electrification', 'Speaker', 'Jury'],
    photo_url: '/uploads/nominations/Dr. Sachin Shigwan.jpg',
    bg_gradient: 'linear-gradient(160deg,#5a8a70,#3a6a52)'
  },
  {
    name: 'Dr. Akshay Kumar',
    role: 'Founder & Director',
    org: 'BroGhar Realty pvt. Ltd.',
    tags: ['Real Estate', 'Entrepreneur', 'Speaker'],
    photo_url: '/uploads/nominations/Dr. Akshay kumar.png',
    bg_gradient: 'linear-gradient(160deg,#e52d27,#7303c0)'
  },
  {
    name: 'Itesh Lakum',
    role: 'Founder & Agricultural Specialist',
    org: 'Sustainable Farming Group',
    tags: ['Organic Farming', 'Speaker'],
    photo_url: '/uploads/nominations/Itesh Lakum.jpg',
    bg_gradient: 'linear-gradient(160deg,#2a3a7a,#1a2a6a)'
  },
  {
    name: 'Nilesh Priyadarshi',
    role: 'Founder & CEO',
    org: 'Kaarigar Clinic',
    tags: ['Social Entrepreneur', 'Rural Development', 'Speaker', 'Jury'],
    photo_url: '/uploads/nominations/Nilesh Priyadarshi.jpg',
    bg_gradient: 'linear-gradient(160deg,#8a3a9a,#5a1a7a)'
  },
  {
    name: 'Niraj Shah',
    role: 'District Executive Director',
    org: 'Peers Global (Ahmedabad)',
    tags: ['Advisor', 'Speaker', 'Jury'],
    photo_url: '/uploads/nominations/Niraj Shah.jpg',
    bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
  },
  {
    name: 'Samir Sinha',
    role: 'PCCF & Head of Forest Force',
    org: 'Government of Uttarakhand',
    tags: ['Conservation', 'Forestry', 'Speaker', 'Jury'],
    photo_url: '/uploads/nominations/Samir Sinha.jpg',
    bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
  },
  {
    name: 'Vinod Malviya',
    role: 'Director & Water Recovery Specialist',
    org: 'Shubham Inc. / Green Lungs',
    tags: ['Wastewater Engineering', 'Green Building', 'Speaker'],
    photo_url: '/uploads/nominations/Vinod Malviya.jpg',
    bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
  },
  {
    name: 'Phani Trivedi',
    role: 'Founder',
    org: 'WeEngage Global Foundation & IGBC Accredited Professional',
    tags: ['Founder', 'Sustainability', 'Speaker'],
    photo_url: '/uploads/nominations/Phani Trivedi.jpg',
    bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
  },
  {
    name: 'Unmesh Dixit',
    role: 'Executive Director',
    org: 'AMA',
    tags: ['Executive Director', 'Mentor', 'Speaker'],
    photo_url: '/uploads/nominations/Unmesh Dixit.jpg',
    bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
  },
  {
    name: 'Rohan Shah',
    role: 'Design Thinking & Digital Transformation expert, Founder',
    org: 'Founders+',
    tags: ['Design Thinking', 'Digital Transformation', 'Founder', 'Speaker'],
    photo_url: '/uploads/nominations/Rohan Shah.jpg',
    bg_gradient: 'linear-gradient(160deg,#2a3a7a,#1a2a6a)'
  }
];

async function insertAdditionalSpeakers() {
  try {
    console.log('Inserting 12 additional speakers into jury table...');
    for (const s of additionalSpeakers) {
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
      console.log(`✅ Inserted: ${s.name}`);
    }
    console.log('\x1b[32m\u2705 Additional insertions finished successfully!\x1b[0m');
    process.exit(0);
  } catch (error) {
    console.error('❌ Insertion failed:', error);
    process.exit(1);
  }
}

insertAdditionalSpeakers();
