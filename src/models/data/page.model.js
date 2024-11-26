const { Schema, model } = require("mongoose");

const PageModel = new Schema({
    img: [],
    slug: {
        type: String,
        required: [true, 'Link doesn\'t exist']
    },
    status: {
        type: Number,
        default: 1
    },
})

module.exports = model("page", PageModel)