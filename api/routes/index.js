// Global imports
const express = require('express');
// Local imports
const authRoutes = require('./auth-routes');
const adminRoutes = require('./admin-routes');
const categoriesRoutes = require('./categories-routes');
const commentsRoutes = require('./comments-routes');
const profileRoutes = require('./profile-routes');
const storiesRoutes = require('./stories-routes');
const videosRoutes = require('./videos-routes');

router = express.Router();

router.use('/auth', authRoutes);
router.use('/api', adminRoutes);
router.use('/api', categoriesRoutes);
router.use('/api', commentsRoutes);
router.use('/api', profileRoutes);
router.use('/api', storiesRoutes);
// router.use('/api', videosRoutes);

module.exports = router;
