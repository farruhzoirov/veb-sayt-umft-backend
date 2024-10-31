const {Schema, model} = require("mongoose");

const CategorySchema = new Schema({
    img:[],
    slug: {
        type: String,
    },
    status: {
        type: Number,
        default:0
    },
},{
    timestamps:true
})

module.exports = model("category", CategorySchema);