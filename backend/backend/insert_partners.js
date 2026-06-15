import pool from './config/db.js';

const partnersData = [
  {
    name: '0 West',
    role: 'Sustainability Partner',
    org: '0 West Sustainability Solutions',
    tags: ['Zero Waste', 'Sustainability'],
    photo_url: '/uploads/nominations/0 West.png',
    bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
  },
  {
    name: '123 Eco-Solutions',
    role: 'Support Partner',
    org: '123 Group',
    tags: ['Eco-Solutions', 'Green Energy'],
    photo_url: '/uploads/nominations/123.png',
    bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
  },
  {
    name: 'Agroyis',
    role: 'Agro-Tech Partner',
    org: 'Agroyis Agri Solutions',
    tags: ['Agro-Tech', 'Organic Farming'],
    photo_url: '/uploads/nominations/Agroyis.png',
    bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
  },
  {
    name: 'All About',
    role: 'Branding & Marketing Partner',
    org: 'All About Marketing Consultancy',
    tags: ['Branding', 'Marketing'],
    photo_url: '/uploads/nominations/All About.png',
    bg_gradient: 'linear-gradient(160deg,#5a8a70,#3a6a52)'
  },
  {
    name: 'Body Tales',
    role: 'Organic Wellness Partner',
    org: 'The Body Tales Skin Care',
    tags: ['Organic Wellness', 'Cosmetics'],
    photo_url: '/uploads/nominations/Body Tales.png',
    bg_gradient: 'linear-gradient(160deg,#2a3a7a,#1a2a6a)'
  },
  {
    name: 'Concepts Green',
    role: 'Green Consultancy Partner',
    org: 'Concepts Green Consultancy',
    tags: ['Green Tech', 'Consulting'],
    photo_url: '/uploads/nominations/Concepts. green.png',
    bg_gradient: 'linear-gradient(160deg,#8a3a9a,#5a1a7a)'
  },
  {
    name: 'DevX',
    role: 'Ecosystem & Incubation Partner',
    org: 'DevX Co-Working & Innovation',
    tags: ['Incubation', 'Startups', 'Co-working'],
    photo_url: '/uploads/nominations/DevX.png',
    bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
  },
  {
    name: 'Glam Greens Herbal Care',
    role: 'Natural Wellness Partner',
    org: 'Glam Greens Herbal Care Products',
    tags: ['Herbal Care', 'Organic Products'],
    photo_url: '/uploads/nominations/Glam Greens Herbal Care.png',
    bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
  },
  {
    name: 'Gyan Enviro',
    role: 'Environmental Consultant Partner',
    org: 'Gyan Enviro Consultants',
    tags: ['Waste Management', 'Audit', 'Environmental'],
    photo_url: '/uploads/nominations/Gyan Enviro.png',
    bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
  },
  {
    name: 'IBS',
    role: 'Education & Knowledge Partner',
    org: 'ICFAI Business School',
    tags: ['Education', 'Mentorship', 'Business School'],
    photo_url: '/uploads/nominations/IBS.png',
    bg_gradient: 'linear-gradient(160deg,#5a8a70,#3a6a52)'
  },
  {
    name: 'IDBI Bank',
    role: 'Banking Partner',
    org: 'IDBI Bank Limited',
    tags: ['Banking', 'Finance', 'SME Loans'],
    photo_url: '/uploads/nominations/IDBI Bank.png',
    bg_gradient: 'linear-gradient(160deg,#2a3a7a,#1a2a6a)'
  },
  {
    name: 'Navitas Green Solutions Pvt. Ltd.',
    role: 'Solar Technology Partner',
    org: 'Navitas Solar',
    tags: ['Solar Energy', 'Renewables', 'Manufacturing'],
    photo_url: '/uploads/nominations/Navitas Green Solutions Pvt. Ltd.png',
    bg_gradient: 'linear-gradient(160deg,#8a3a9a,#5a1a7a)'
  },
  {
    name: 'Rupee Boss',
    role: 'Financial Services Partner',
    org: 'Rupeeboss Financial Services Pvt. Ltd.',
    tags: ['Financial Services', 'Loans', 'SME Growth'],
    photo_url: '/uploads/nominations/Rupee Boss.png',
    bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
  },
  {
    name: 'WAACAB',
    role: 'Solar Energy Solutions Partner',
    org: 'WAACAB Solar Technology',
    tags: ['Solar Tech', 'Renewables'],
    photo_url: '/uploads/nominations/WAACAB.png',
    bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
  }
];

async function insertPartners() {
  try {
    console.log('Inserting 14 partners into partners table...');
    for (const p of partnersData) {
      // Check if partner already exists by name
      const [existing] = await pool.query('SELECT id FROM partners WHERE name = ?', [p.name]);
      if (existing.length > 0) {
        console.log(`Partner "${p.name}" already exists, skipping...`);
        continue;
      }

      await pool.query(
        'INSERT INTO partners (name, role, org, tags, photo_url, bg_gradient, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [p.name, p.role, p.org, JSON.stringify(p.tags), p.photo_url, p.bg_gradient]
      );
      console.log(`\u2705 Inserted: ${p.name}`);
    }
    console.log('\u001b[32m\u200b\u2705 Insertion finished successfully!\u001b[0m');
    process.exit(0);
  } catch (error) {
    console.error('\u274c Insertion failed:', error);
    process.exit(1);
  }
}

insertPartners();
