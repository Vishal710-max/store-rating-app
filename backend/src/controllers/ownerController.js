const storeModel = require('../models/storeModel');
const { wrapAll } = require('../utils/asyncHandler');

// Only ever looks up the store owned by req.user.id — an owner can never
// pass a storeId and see someone else's data.
async function dashboard(req, res) {
  const data = await storeModel.getOwnerDashboard(req.user.id);
  if (!data) {
    return res.status(404).json({ message: 'No store is associated with this account' });
  }
  res.json(data);
}

module.exports = wrapAll({ dashboard });
