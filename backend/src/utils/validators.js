const { body, param, query } = require('express-validator');

// Name: 20–60 characters.
const nameRule = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

// Address: up to 400 characters, optional.
const addressRule = body('address')
  .optional({ checkFalsy: true })
  .trim()
  .isLength({ max: 400 })
  .withMessage('Address must be at most 400 characters');

// Email: standard format check.
const emailRule = body('email')
  .trim()
  .isEmail()
  .withMessage('A valid email address is required')
  .normalizeEmail();

// Password: 8–16 characters, at least one uppercase letter, at least one special character.
const passwordRule = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8–16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

// Rating: integer between 1 and 5.
const ratingRule = body('rating')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating must be an integer between 1 and 5');

const idParamRule = (name = 'id') =>
  param(name).isInt({ min: 1 }).withMessage(`${name} must be a positive integer`);

module.exports = {
  nameRule,
  addressRule,
  emailRule,
  passwordRule,
  ratingRule,
  idParamRule,
};
