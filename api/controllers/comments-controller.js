const Comment = require('./../models/comment');

const createOne = async (req, res) => {
  try {
    const newComment = new Comment({ ...req.body, createdBy: req.user._id });
    await newComment.save();
    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'Comment created successfully!',
        comment: newComment,
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

const deleteOne = async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete({ _id: req.params.id });

    if (!deleted) {
      return res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Comment not found!',
        },
      });
    }

    return res.status(204).json({
      status: 'success',
      data: {
        success: true,
        message: 'Comment deleted successfully!',
        comment: null,
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
  createOne,
  deleteOne,
};
