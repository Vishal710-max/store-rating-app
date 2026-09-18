const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const storeModel = require('../models/storeModel');
const { wrapAll } = require('../utils/asyncHandler');

async function dashboard(req, res) {
  const counts = await storeModel.getDashboardCounts();
  res.json(counts);
}

// Creates a user with any role (ADMIN, USER, STORE_OWNER) — this is the only
// way non-USER accounts get created, which is why it's admin-only.
async function addUser(req, res) {
  const { name, email, password, address, role } = req.body;

  const existing = await userModel.findByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({ name, email, passwordHash, address, role });
  res.status(201).json(user);
}

async function addStore(req, res) {
  const { name, email, address, ownerId } = req.body;
  const store = await storeModel.createStore({ name, email, address, ownerId });
  res.status(201).json(store);
}

// GET /admin/users?search=&role=&sortBy=&sortDir=
async function getUsers(req, res) {
  const { search, role, sortBy, sortDir } = req.query;
  const users = await userModel.listUsers({ search, role, sortBy, sortDir });
  res.json(users);
}

async function getUserDetail(req, res) {
  const user = await userModel.getUserDetail(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

// GET /admin/stores?search=&sortBy=&sortDir=
async function getStores(req, res) {
  const { search, sortBy, sortDir } = req.query;
  const stores = await storeModel.listStoresForAdmin({ search, sortBy, sortDir });
  res.json(stores);
}

module.exports = wrapAll({ dashboard, addUser, addStore, getUsers, getUserDetail, getStores });
