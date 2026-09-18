const express = require('express');
const router = express.Router();

const ownerController = require('../controllers/ownerController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth, requireRole('STORE_OWNER'));

router.get('/dashboard', ownerController.dashboard);

module.exports = router;
