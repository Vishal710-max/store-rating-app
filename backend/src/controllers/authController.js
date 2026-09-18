const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { wrapAll } = require('../utils/asyncHandler');

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// Public self-signup — always creates a normal USER account.
// Admins and store owners are created by an admin via /admin/users, not here.
async function register(req, res) {
  const { name, email, password, address } = req.body;

  const existing = await userModel.findByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({ name, email, passwordHash, address, role: 'USER' });

  const token = signToken(user);
  res.status(201).json({ token, user });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

// Applies to any authenticated role (Admin, User, Store Owner) per the spec.
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  const user = await userModel.findByIdWithHash(userId);
  const match = await bcrypt.compare(currentPassword, user.password_hash);
  if (!match) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await userModel.updatePassword(userId, newHash);
  res.json({ message: 'Password updated successfully' });
}

module.exports = wrapAll({ register, login, changePassword });
