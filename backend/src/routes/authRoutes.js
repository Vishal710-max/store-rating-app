const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { nameRule, emailRule, passwordRule, addressRule } = require('../utils/validators');
const { body } = require('express-validator');

router.post(
  '/register',
  [nameRule, emailRule, passwordRule, addressRule],
  validate,
  authController.register
);

router.post(
  '/login',
  [emailRule, body('password').notEmpty().withMessage('Password is required')],
  validate,
  authController.login
);

router.post(
  '/change-password',
  requireAuth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .withMessage('New password must be 8–16 characters')
      .matches(/[A-Z]/)
      .withMessage('New password must contain at least one uppercase letter')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('New password must contain at least one special character'),
  ],
  validate,
  authController.changePassword
);

module.exports = router;
