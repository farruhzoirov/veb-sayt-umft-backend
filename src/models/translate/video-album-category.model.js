const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const VideoAlbumTranslateSchema = new Schema({
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
  videoAlbumCategory: {
    type: Schema.Types.ObjectId,
    ref: "videoAlbumCategory",
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: "language",
    required: true,
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('videoAlbumCategoryTranslate', VideoAlbumTranslateSchema);