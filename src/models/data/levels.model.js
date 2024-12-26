const mongoose = require("mongoose");
const {Schema} = require("mongoose");

// Namely course  1, 2, 3, 4
const LevelSchema = new Schema({
    img: [],
    slug: {
        type: String,
        required: [true, 'Slug is required'],
    },
    status: {
        type: Number,
        default: 1
    },
    course: {
        type: Number,
        required: true,
    },
    level: {
        type: Schema.Types.ObjectId,
        ref: "level",
    },
}, {
    timestamps: true
});


module.exports = mongoose.model("level", LevelSchema);

