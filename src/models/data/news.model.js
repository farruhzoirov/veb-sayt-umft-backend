const { Schema, model } = require("mongoose");

const NewsModel = new Schema({
    img: [],
    category:{
      type:Schema.Types.ObjectId,
      ref:'category'
    },
    views:{
      type:Number,
      default:0  
    },
    slug: {
        type: String,
        required: [true, 'Havola mavjud emas!']
    },
    status: {
        type: Number,
        default: 0
    },
}, { timestamps: true })

module.exports = model("news", NewsModel)