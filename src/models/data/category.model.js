const {Schema, model} = require("mongoose");

const CategorySchema = new Schema({
    img: [],
    slug: {
        type: String,
    },
    status: {
        type: Number,
        default: 1
    },
}, {
    timestamps: true
})

module.exports = model("category", CategorySchema);