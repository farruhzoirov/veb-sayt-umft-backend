const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const SocialsTranslateSchema = new Schema(
    {
        social: {
            type: Schema.Types.ObjectId,
            ref: 'social',
        },
       title: {
            type: String
       },
        text: {
            type: String
        },
        language: {
            type: Schema.Types.ObjectId,
            ref: 'language',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("socialTranslate", SocialsTranslateSchema);
