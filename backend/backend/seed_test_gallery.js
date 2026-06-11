import pool from './config/db.js';

async function seedData() {
  try {
    // Clear existing records first to start clean
    await pool.query('DELETE FROM sponsors');
    await pool.query('DELETE FROM partners');
    await pool.query('DELETE FROM jury');

    console.log('🧹 Cleared old gallery data');

    // 1. Seed Sponsors
    const sponsors = [
      {
        name: 'Adani Solar',
        role: 'Platinum Sponsor',
        org: 'Adani Group',
        tags: JSON.stringify(['Solar', 'Renewables']),
        photo_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&h=400&q=80',
        bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
      },
      {
        name: 'Tata Power',
        role: 'Gold Sponsor',
        org: 'Tata Sons',
        tags: JSON.stringify(['Power', 'Wind']),
        photo_url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=400&h=400&q=80',
        bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
      },
      {
        name: 'Sponsor Without Image',
        role: 'Silver Sponsor',
        org: 'Anonymous Inc',
        tags: JSON.stringify(['Finance']),
        photo_url: null, // Should NOT display in home gallery
        bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
      }
    ];

    for (const s of sponsors) {
      await pool.query(
        'INSERT INTO sponsors (name, role, org, tags, photo_url, bg_gradient, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [s.name, s.role, s.org, s.tags, s.photo_url, s.bg_gradient]
      );
    }
    console.log('✅ Seeded 3 sponsors (1 without photo)');

    // 2. Seed Partners
    const partners = [
      {
        name: 'Ministry of New & Renewable Energy',
        role: 'Knowledge Partner',
        org: 'Government of India',
        tags: JSON.stringify(['Government', 'Policy']),
        photo_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&h=400&q=80',
        bg_gradient: 'linear-gradient(160deg,#5a8a70,#3a6a52)'
      },
      {
        name: 'IIT Ahmedabad Incubation',
        role: 'Technology Partner',
        org: 'IIT',
        tags: JSON.stringify(['Education', 'Research']),
        photo_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&h=400&q=80',
        bg_gradient: 'linear-gradient(160deg,#2a3a7a,#1a2a6a)'
      },
      {
        name: 'Partner Without Image',
        role: 'Media Partner',
        org: 'EcoNews',
        tags: JSON.stringify(['Media']),
        photo_url: null, // Should NOT display in home gallery
        bg_gradient: 'linear-gradient(160deg,#8a3a9a,#5a1a7a)'
      }
    ];

    for (const p of partners) {
      await pool.query(
        'INSERT INTO partners (name, role, org, tags, photo_url, bg_gradient, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [p.name, p.role, p.org, p.tags, p.photo_url, p.bg_gradient]
      );
    }
    console.log('✅ Seeded 3 partners (1 without photo)');

    // 3. Seed Jury Members
    const jury = [
      {
        name: 'Dr. Sunita Narain',
        role: 'Director General',
        org: 'Centre for Science and Environment',
        tags: JSON.stringify(['Environmentalist', 'Jury Chair']),
        photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
        bg_gradient: 'linear-gradient(160deg,#5a9a6a,#3d7a50)'
      },
      {
        name: 'Prof. Anil Gupta',
        role: 'Founder',
        org: 'Honey Bee Network',
        tags: JSON.stringify(['Grassroots Innovation', 'Jury Member']),
        photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80',
        bg_gradient: 'linear-gradient(160deg,#4a8a90,#2d6a70)'
      },
      {
        name: 'Jury Without Image',
        role: 'Professor',
        org: 'IISc Bangalore',
        tags: JSON.stringify(['Climate Physics']),
        photo_url: null, // Should NOT display in home gallery
        bg_gradient: 'linear-gradient(160deg,#7a9a60,#5a7a44)'
      }
    ];

    for (const j of jury) {
      await pool.query(
        'INSERT INTO jury (name, role, org, tags, photo_url, bg_gradient, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [j.name, j.role, j.org, j.tags, j.photo_url, j.bg_gradient]
      );
    }
    console.log('✅ Seeded 3 jury members (1 without photo)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedData();
