const { Schema, model } = require("mongoose");

const PageModel = new Schema({
    img: [],
    slug: {
        type: String,
        required: [true, 'Havola mavjud emas!']
    },
    status: {
        type: Number,
        default: 0
    },
})

module.exports = model("page", PageModel)