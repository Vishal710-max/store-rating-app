const { query } = require('../config/db');

// Submits a new rating, or updates the existing one for this user+store.
// Relies on the DB's UNIQUE (user_id, store_id) constraint as the source of truth,
// so a race between two requests still can't create a duplicate row.
async function upsertRating({ userId, storeId, rating }) {
  const { rows } = await query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET rating = EXCLUDED.rating
     RETURNING id, user_id, store_id, rating, created_at, updated_at`,
    [userId, storeId, rating]
  );
  return rows[0];
}

async function findByUserAndStore(userId, storeId) {
  const { rows } = await query(
    'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
    [userId, storeId]
  );
  return rows[0];
}

module.exports = { upsertRating, findByUserAndStore };
