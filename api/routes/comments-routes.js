// Global includes
const express = require('express');

// Local includes
const { ensureAuthenticated } = require('./../middleware/auth-middleware');
const { createOne, deteleOne } = require('./../controllers/comments-controller');

const router = express.Router();

router.post('/comments', ensureAuthenticated, async (req, res) => {
  await createOne(req, res);
});

router.delete('/comments/:id', ensureAuthenticated, async (req, res) => {
  await removeOne(req, res);
});

module.exports = router;
