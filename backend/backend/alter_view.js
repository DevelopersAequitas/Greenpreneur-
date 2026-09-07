import pool from './config/db.js';

async function alterView() {
  try {
    const query = `
      CREATE OR REPLACE VIEW v_nominations_summary AS
      SELECT
        n.id,
        n.nominee_name,
        n.business_name,
        n.email,
        n.phone,
        n.city,
        ac.name AS category,
        ac.group_name AS category_group,
        n.track,
        n.package,
        n.package_amount,
        n.status,
        n.payment_status,
        n.jury_score,
        (SELECT COUNT(*) FROM nomination_votes WHERE nomination_id = n.id) AS public_votes,
        n.award_year,
        n.voting_url,
        n.profile_picture,
        n.business_logo,
        n.created_at,
        n.updated_at
      FROM nominations n
      LEFT JOIN award_categories ac ON n.category_id = ac.id
    `;
    await pool.query(query);
    console.log('View updated successfully');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
alterView();
