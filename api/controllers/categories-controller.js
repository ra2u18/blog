// global imports

// local imports
const Category = require('./../models/category');
const APIFeatures = require('./../utils/APIFeatures');

const createOne = async (req, res) => {
  try {
    const newCategory = new Category({
      ...req.body,
      createdBy: req.user._id,
    });
    await newCategory.save();

    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'Category created successfully!',
        category: newCategory,
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

const deleteOne = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete({ _id: req.params.id });

    if (!deleted) {
      return res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Category not found!',
        },
      });
    }

    return res.status(204).json({
      status: 'success',
      data: {
        success: true,
        message: 'Category deleted successfully!',
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
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        success: true,
        message: 'Category updated successfully!',
        category: updatedCategory,
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
    const dummyObjQuery = Category.find({});
    const features = new APIFeatures(dummyObjQuery, req.query).filter().sort().limitFields().paginate();

    const categories = await features.query;
    // SEND RESPONSE
    return res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        success: true,
        categories: categories,
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
    const category = await Category.findById({ _id: req.params.id });

    if (!category) {
      res.status(404).json({
        status: 'failed',
        data: {
          success: false,
          message: 'Category not found',
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

module.exports = {
  createOne,
  deleteOne,
  updateOne,
  getAll,
  getOne,
};
