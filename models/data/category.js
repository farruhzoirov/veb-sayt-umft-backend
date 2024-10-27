const {Schema, model} = require("mongoose");

// fanlar un categorylar // masalan aniq fanlar gumanitar fanlar
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

module.exports = model("category", CategorySchema)