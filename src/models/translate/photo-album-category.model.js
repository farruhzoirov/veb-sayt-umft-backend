const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const PhotoAlbumTranslateSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  description: {
    type: String,
  },
  photoAlbumCategory: {
    type: Schema.Types.ObjectId,
    ref: "photoAlbumCategory",
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: "language",
    required: true,
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('photoAlbumCategoryTranslate', PhotoAlbumTranslateSchema);