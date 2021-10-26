const passport = require('passport');

const ensureAuthenticated = passport.authenticate('jwt', { session: false });

// check if the use has the specific role of an admin
const ensureAuthorized = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  }
  return res.status(401).json({
    message: 'Unauthorized',
    success: false,
  });
};

module.exports = {
  ensureAuthenticated,
  ensureAuthorized,
};
