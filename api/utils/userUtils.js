const isEmailAvailable = async (email) => {
  let user = await User.findOne({ email: email });
  if (user) return false;

  return true;
};

module.exports = isEmailAvailable;
