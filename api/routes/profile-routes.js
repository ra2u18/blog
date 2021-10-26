// Global includes
const express = require('express');

// Local includes
const { ensureAuthenticated } = require('./../middleware/auth-middleware');
const { updateOne, getOne } = require('./../controllers/profile-controller');

const router = express.Router();

router.get('/profile', ensureAuthenticated, async (req, res) => {
  await getOne(req, res);
});

router.put('/profile', ensureAuthenticated, async (req, res) => {
  await updateOne(req, res);
});

module.exports = router;
