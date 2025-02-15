const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const VideoAlbumSchema = new Schema(
    {
      img: [],
      slug: {
        type: String,
      },
      video: [
        {
          text: String,
          url: String
        }
      ],
      status: {
        type: Number,
        default: 1,
      },
      videoAlbumCategory: {
        type: Schema.Types.ObjectId,
        ref: "videoAlbumCategory",
      }
    },
    {
      timestamps: true,
    }
);


module.exports = mongoose.model("videoAlbum", VideoAlbumSchema);
