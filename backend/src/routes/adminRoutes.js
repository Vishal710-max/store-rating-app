const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const adminController = require('../controllers/adminController');
const validate = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');
const { nameRule, emailRule, passwordRule, addressRule, idParamRule } = require('../utils/validators');

router.use(requireAuth, requireRole('ADMIN'));

router.get('/dashboard', adminController.dashboard);

router.post(
  '/users',
  [nameRule, emailRule, passwordRule, addressRule, body('role').isIn(['ADMIN', 'USER', 'STORE_OWNER'])],
  validate,
  adminController.addUser
);
router.get('/users', adminController.getUsers);
router.get('/users/:id', [idParamRule('id')], validate, adminController.getUserDetail);

router.post(
  '/stores',
  [
    nameRule,
    emailRule,
    addressRule,
    body('ownerId').optional({ checkFalsy: true }).isInt({ min: 1 }),
  ],
  validate,
  adminController.addStore
);
router.get('/stores', adminController.getStores);

module.exports = router;
