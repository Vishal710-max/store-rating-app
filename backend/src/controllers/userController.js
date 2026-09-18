const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');
const { wrapAll } = require('../utils/asyncHandler');

// GET /stores?search=&sortBy=&sortDir= — includes overall rating + this user's own rating.
async function browseStores(req, res) {
  const { search, sortBy, sortDir } = req.query;
  const stores = await storeModel.listStoresForUser({ userId: req.user.id, search, sortBy, sortDir });
  res.json(stores);
}

// POST /stores/:storeId/rating and PUT /stores/:storeId/rating both land here:
// upsertRating submits a new rating or overwrites the caller's existing one.
// storeId comes from the URL, userId always comes from the authenticated token.
async function rateStore(req, res) {
  const storeId = req.params.storeId;
  const { rating } = req.body;

  const store = await storeModel.findById(storeId);
  if (!store) return res.status(404).json({ message: 'Store not found' });

  const result = await ratingModel.upsertRating({ userId: req.user.id, storeId, rating });
  res.status(200).json(result);
}

module.exports = wrapAll({ browseStores, rateStore });
