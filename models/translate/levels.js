const mongoose = require("mongoose");
const {Schema} = require("mongoose");

// Namely course  1, 2, 3, 4
const LevelTranslateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    level: {
        type: Schema.Types.ObjectId,
        ref: "level",
    },
    language : {
        type: Schema.Types.ObjectId,
        ref: "language",
        required: true,
    }
});


module.exports = mongoose.model("levelTranslate", LevelTranslateSchema);

