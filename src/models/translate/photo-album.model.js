const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const PhotoAlbumTranslateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String
  },
  description: {
    type: String,
    required: true,
  },
  photoAlbum: {
    type: Schema.Types.ObjectId,
    ref: "photoAlbum",
    required: true,
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: "language",
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('photoAlbumTranslate', PhotoAlbumTranslateSchema);