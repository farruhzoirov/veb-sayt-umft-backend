const { Schema, model } = require("mongoose");

const Page = new Schema({
    img: [],
    slug: {
        type: String,
        required: [true, 'Havola mavjud emas!']
    },
    status: {
        type: Number,
        default: 0
    },
}, { timestamps: true })

module.exports = model("page", Page)