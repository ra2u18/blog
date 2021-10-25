const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId, // referencing another schema
      ref: 'User',
    },
  },
  { timestamps: true }
);

CategorySchema.plugin(uniqueValidator);
module.exports = model('Category', CategorySchema);
