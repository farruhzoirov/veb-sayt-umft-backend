const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ThemesTranslateSchema = new Schema(
    {
        title: {
            type: String
        },
        text: {
            type: String
        },
        description: {
            type: String
        },
        theme: {
            type: Schema.Types.ObjectId,
            ref: "theme",
            required: true,
        },
        language: {
            type: Schema.Types.ObjectId,
            ref: "language",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("themeTranslate", ThemesTranslateSchema);
