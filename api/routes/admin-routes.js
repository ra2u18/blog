// Global imports
const express = require('express');

// Local imports
const { register } = require('./../controllers/auth-controller');
const { getAll, getOne } = require('./../controllers/admin-controller');
const { ensureAuthenticated, ensureAuthorized } = require('./../middleware/auth-middleware');

// Create admin mini application
router = express.Router();

router.get('/users', ensureAuthenticated, ensureAuthorized(['admin']), getAll);
router.get('/users/:id', ensureAuthenticated, ensureAuthorized(['admin']), getOne);

router.get('/seed', async (req, res) => {
  /*
        #swagger.tags = ['Admin'],
        #swagger.security = [{
            "Authorization": []
        }]
    */

  const admin = {
    name: 'Administrator',
    email: 'admin@rick.com',
    password: 'Password123',
  };

  await register(admin, 'admin', res);
});

module.exports = router;
