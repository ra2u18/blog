// global imports

// local imports
const Video = require('./../models/video');
const APIFeatures = require('./../utils/APIFeatures');

const createOne = async (req, res) => {
  try {
    const newVideo = new Video({ ...req.body, createdBy: req.user._id });

    // Story created successfully
    await newVideo.save();
    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'Video created successfully!',
        video: newVideo,
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
    const deleted = await Video.findByIdAndDelete({ _id: req.params.id });

    if (!deleted) {
      return res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Video not found!',
        },
      });
    }

    return res.status(204).json({
      status: 'success',
      data: {
        success: true,
        message: 'Video deleted successfully!',
        category: null,
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

const updateOne = async (req, res) => {
  try {
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'Video updated successfully!',
        video: updatedVideo,
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

const getAll = async (req, res) => {
  try {
    const dummyObjQuery = Video.find({});
    const features = new APIFeatures(dummyObjQuery, req.query).filter().sort().limitFields().paginate();

    const videos = await features.query;
    // SEND RESPONSE
    return res.status(200).json({
      status: 'success',
      results: videos.length,
      data: {
        success: true,
        videos: videos,
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
    const video = await Video.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } });

    if (!video) {
      res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Video not found',
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        success: true,
        video: video,
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
  updateOne,
  getAll,
  getOne,
};
