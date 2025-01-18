const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const ThemesSchema = new Schema(
    {
      topic: {
        type: Schema.Types.ObjectId,
        ref: "topic",
        required: true,
      },
      slug: {
        type: String,
      },
      status: {
        type: Number,
        default: 1,
      },
      img: [],
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("theme", ThemesSchema);
