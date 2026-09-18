const { query } = require('../config/db');

async function createStore({ name, email, address, ownerId }) {
  const { rows } = await query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, address, owner_id, created_at`,
    [name, email, address || null, ownerId || null]
  );
  return rows[0];
}

// Admin store listing: name/address/email search + sort, with overall rating.
async function listStoresForAdmin({ search, sortBy = 'name', sortDir = 'ASC' }) {
  const allowedSort = ['name', 'email', 'address', 'created_at', 'overall_rating'];
  const column = allowedSort.includes(sortBy) ? sortBy : 'name';
  const direction = sortDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const params = [];
  let whereClause = '';
  if (search) {
    params.push(`%${search}%`);
    whereClause = `WHERE (s.name ILIKE $${params.length} OR s.address ILIKE $${params.length} OR s.email ILIKE $${params.length})`;
  }

  const { rows } = await query(
    `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
            COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS overall_rating,
            COUNT(r.id) AS rating_count
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${whereClause}
     GROUP BY s.id
     ORDER BY ${column} ${direction}`,
    params
  );
  return rows;
}

// Normal-user store listing: same as above, plus that user's own rating for each store.
async function listStoresForUser({ userId, search, sortBy = 'name', sortDir = 'ASC' }) {
  const allowedSort = ['name', 'address', 'overall_rating'];
  const column = allowedSort.includes(sortBy) ? sortBy : 'name';
  const direction = sortDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const params = [userId];
  let whereClause = '';
  if (search) {
    params.push(`%${search}%`);
    whereClause = `WHERE (s.name ILIKE $${params.length} OR s.address ILIKE $${params.length})`;
  }

  const { rows } = await query(
    `SELECT s.id, s.name, s.address,
            COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS overall_rating,
            ur.rating AS my_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $1
     ${whereClause}
     GROUP BY s.id, ur.rating
     ORDER BY ${column} ${direction}`,
    params
  );
  return rows;
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM stores WHERE id = $1', [id]);
  return rows[0];
}

// Dashboard for a store owner: average rating + list of raters, scoped to their own store only.
async function getOwnerDashboard(ownerId) {
  const storeRes = await query('SELECT id, name FROM stores WHERE owner_id = $1', [ownerId]);
  const store = storeRes.rows[0];
  if (!store) return null;

  const avgRes = await query(
    'SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS average_rating, COUNT(*) AS rating_count FROM ratings WHERE store_id = $1',
    [store.id]
  );

  const ratersRes = await query(
    `SELECT u.id, u.name, u.email, r.rating, r.created_at
     FROM ratings r JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY r.created_at DESC`,
    [store.id]
  );

  return {
    store,
    averageRating: avgRes.rows[0].average_rating,
    ratingCount: avgRes.rows[0].rating_count,
    raters: ratersRes.rows,
  };
}

async function getDashboardCounts() {
  const { rows } = await query(`
    SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM stores) AS total_stores,
      (SELECT COUNT(*) FROM ratings) AS total_ratings
  `);
  return rows[0];
}

module.exports = {
  createStore,
  listStoresForAdmin,
  listStoresForUser,
  findById,
  getOwnerDashboard,
  getDashboardCounts,
};
