const User = require('./../models/user');

const updateOne = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body);
    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'User updated successfully!',
        user: updatedUser,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      data: {
        success: false,
        message: err.message,
      },
    });
  }
};

const getOne = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'User not found',
        },
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        success: true,
        user: user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      data: {
        success: false,
        message: err.message,
      },
    });
  }
};

module.exports = {
  updateOne,
  getOne,
};
