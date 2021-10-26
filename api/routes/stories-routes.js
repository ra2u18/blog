// Global includes
const express = require('express');

// Local includes
const { ensureAuthenticated, ensureAuthorized } = require('./../middleware/auth-middleware');
const {
  createOne,
  deleteOne,
  updateOne,
  getAll,
  getOne,
  getOneBySlug,
} = require('./../controllers/stories-controller');

const router = express.Router();

router.get('/stories', async (req, res) => {
  await getAll(req, res);
});

router.get('/stories/:id', async (req, res) => {
  await getOne(req, res);
});

router.get('/stories/slug/:slug', async (req, res) => {
  await getOneBySlug(req, res);
});

router.post('/stories', ensureAuthenticated, ensureAuthorized(['admin']), async (req, res) => {
  await createOne(req, res);
});

router.put('/stories/:id', async (req, res) => {
  await updateOne(req, res);
});

router.delete('/stories/:id', ensureAuthenticated, ensureAuthorized(['admin']), async (req, res) => {
  await deleteOne(req, res);
});

module.exports = router;
