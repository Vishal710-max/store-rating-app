const { query } = require('../config/db');

async function createUser({ name, email, passwordHash, address, role }) {
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role, created_at`,
    [name, email, passwordHash, address || null, role]
  );
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
}

async function findById(id) {
  const { rows } = await query(
    'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
}

async function findByIdWithHash(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

async function updatePassword(id, passwordHash) {
  await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, id]);
}

// Supports optional name/email/address search and sorting, used by the admin user list.
async function listUsers({ search, role, sortBy = 'name', sortDir = 'ASC' }) {
  const allowedSort = ['name', 'email', 'role', 'created_at'];
  const column = allowedSort.includes(sortBy) ? sortBy : 'name';
  const direction = sortDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length} OR address ILIKE $${params.length})`);
  }
  if (role) {
    params.push(role);
    conditions.push(`role = $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await query(
    `SELECT id, name, email, address, role, created_at
     FROM users
     ${whereClause}
     ORDER BY ${column} ${direction}`,
    params
  );
  return rows;
}

// A user's detail view, including their store's average rating when they are a STORE_OWNER.
async function getUserDetail(id) {
  const { rows } = await query(
    `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
            (SELECT ROUND(AVG(r.rating)::numeric, 2)
               FROM ratings r JOIN stores s ON s.id = r.store_id
              WHERE s.owner_id = u.id) AS store_owner_rating
     FROM users u
     WHERE u.id = $1`,
    [id]
  );
  return rows[0];
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  findByIdWithHash,
  updatePassword,
  listUsers,
  getUserDetail,
};
