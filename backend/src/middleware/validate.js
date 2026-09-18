const { validationResult } = require('express-validator');

// Run this after a chain of express-validator rules on a route.
// Collects any failures into a consistent 400 response shape.
module.exports = function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => ({ field: e.path, message: e.msg })) });
  }
  next();
};
