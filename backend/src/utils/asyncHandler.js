// Express 4 doesn't forward rejected promises from async route handlers
// to next() automatically. Wrap every async controller with this.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// Convenience: wraps every function on a controller module in one call,
// so `module.exports = wrapAll({ login, register, ... })` covers a whole file.
function wrapAll(controllerObject) {
  return Object.fromEntries(
    Object.entries(controllerObject).map(([key, fn]) => [key, asyncHandler(fn)])
  );
}

module.exports = asyncHandler;
module.exports.wrapAll = wrapAll;
