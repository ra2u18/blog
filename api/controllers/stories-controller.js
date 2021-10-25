// global imports
const paginate = require('express-paginate');
const slugify = require('slugify');

// local imports
const Category = require('./../models/story');
const APIFeatures = require('./../utils/APIFeatures');

const createOne = async (req, res) => {
  const newStory = new Story({
    ...req.body,
    createdBy: req.user._id,
  });

  try {
    if (!newStory.slug) {
      newStory.slug = slugify(newStory.title);
    }

    // Story created successfully
    await newStory.save();
    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'Story created successfully!',
        story: newStory,
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
    const deleted = await Story.findByIdAndDelete({ _id: req.params.id });

    if (!deleted) {
      return res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Story not found!',
        },
      });
    }

    return res.status(204).json({
      status: 'success',
      data: {
        success: true,
        message: 'Story deleted successfully!',
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
    const storyContent = req.body;
    storyContent.slug = slugify(story.title);

    const updatedStory = await Story.findByIdAndUpdate(req.params.id, storyContent, {
      new: true,
      runValidators: true,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'Story updated successfully!',
        story: updatedStory,
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
    const dummyObjQuery = Story.find({});
    const features = new APIFeatures(dummyObjQuery, req.query).filter().sort().limitFields().paginate();

    const stories = await features.query;
    // SEND RESPONSE
    return res.status(200).json({
      status: 'success',
      results: stories.length,
      data: {
        success: true,
        stories: stories,
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
    const story = await Story.findById({ _id: req.params.id });

    if (!story) {
      res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Story not found',
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: { category: category },
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

const getOneBySlug = async (req, res) => {
  try {
    let story = await Story.findOneAndUpdate({ slug: req.params.slug }, { $inc: { viewsCount: 1 } }).populate({
      path: 'category',
      select: 'title',
    });

    if (!story) {
      res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Story not found',
        },
      });
    }

    // Story was found, load comments as well
    story.comments = await Comment.find({ story: story._id });
    res.status(200).json({
      status: 'success',
      data: { success: true, story: story },
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
  getOneBySlug,
};
