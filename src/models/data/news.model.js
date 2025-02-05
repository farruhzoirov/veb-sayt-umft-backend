const {Schema, model} = require("mongoose");

const NewsModel = new Schema({
  img: [],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category'
  },
  views: {
    type: Number,
    default: 0
  },
  monthlyViews: {
    type: Object,
    default: {}
  },
  slug: {
    type: String,
    required: [true, 'slug is required']
  },
  status: {
    type: Number,
    default: 1
  },
}, {
  timestamps: true
})

module.exports = model("news", NewsModel);