const {Schema} = require('mongoose')
const mongoose = require("mongoose");

const VideoAlbumCategorySchema = new Schema({
  img: [],
  slug: {
    type: String,
  },
  status: {
    type: Number,
    default: 1
  },
}, {
  timestamps: true
});


module.exports = mongoose.model('videoAlbumCategory', VideoAlbumCategorySchema);