// Global includes
const express = require('express');

// Local includes
const { ensureAuthenticated, ensureAuthorized } = require('./../middleware/auth-middleware');
const { createOne, deleteOne, updateOne, getAll, getOne } = require('./../controllers/categories-controller');

const router = express.Router();

router.get('/categories', async (req, res) => {
  await getAll(req, res);
});

router.post('/categories', ensureAuthenticated, ensureAuthorized(['admin']), async (req, res) => {
  await createOne(req, res);
});

router.put('/categories/:id', ensureAuthenticated, ensureAuthorized(['admin']), async (req, res) => {
  await updateOne(req, res);
});

router.get('/categories/:id', async (req, res) => {
  await getOne(req, res);
});

router.delete('/categories/:id', ensureAuthenticated, ensureAuthorized(['admin']), async (req, res) => {
  await deleteOne(req, res);
});

module.exports = router;
