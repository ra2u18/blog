const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const StorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    image: {
      type: String,
      required: [true, 'Image Path is required'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId, // referencing another schema
      ref: 'Category',
    },
    comments: [
      {
        type: Schema.Types.ObjectId, // referencing another schema
        ref: 'Comment',
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId, // referencing another schema
      ref: 'User',
    },
  },
  { timestamps: true }
);

StorySchema.plugin(uniqueValidator);
module.exports = model('Story', StorySchema);
