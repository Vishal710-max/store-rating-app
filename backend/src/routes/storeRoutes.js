const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ratingRule, idParamRule } = require('../utils/validators');

router.use(requireAuth, requireRole('USER'));

router.get('/', userController.browseStores);

router.post(
  '/:storeId/rating',
  [idParamRule('storeId'), ratingRule],
  validate,
  userController.rateStore
);
router.put(
  '/:storeId/rating',
  [idParamRule('storeId'), ratingRule],
  validate,
  userController.rateStore
);

module.exports = router;
