const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const PhotoAlbumSchema = new Schema(
    {
      img: [],
      slug: {
        type: String,
      },
      status: {
        type: Number,
        default: 1,
      },
      photoAlbumCategory: {
        type: Schema.Types.ObjectId,
        ref: "photoAlbumCategory",
      }
    },
    {
      timestamps: true,
    }
);


module.exports = mongoose.model("photoAlbum", PhotoAlbumSchema);
