const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const VideoAlbumTranslateSchema = new Schema({
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
  videoAlbum: {
    type: Schema.Types.ObjectId,
    ref: "videoAlbum",
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

module.exports = mongoose.model('videoAlbumTranslate', VideoAlbumTranslateSchema);