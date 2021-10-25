const User = require('./../models/user');

const getAll = async (req, res) => {
  try {
    const dummyObjQuery = User.find({});
    const features = new APIFeatures(dummyObjQuery, req.query).filter().sort().limitFields().paginate();

    const users = await features.query;
    // SEND RESPONSE
    return res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        success: true,
        users: users,
      },
    });
  } catch (err) {
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
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'User not found',
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        success: true,
        user: user,
      },
    });
  } catch (err) {
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
  getAll,
  getOne,
};
