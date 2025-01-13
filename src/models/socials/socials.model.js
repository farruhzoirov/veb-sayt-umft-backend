const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const SocialsSchema = new Schema(
    {
      messenger: {
        type: Schema.Types.ObjectId,
        ref: 'messenger',
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      slug: {
        type: String
      },
      status: {
        type: Number,
        default: 1,
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("social", SocialsSchema);
