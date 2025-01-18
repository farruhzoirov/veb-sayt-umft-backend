const {Schema, model} = require("mongoose");

const PageModel = new Schema({
  img: [],
  slug: {
    type: String,
    required: [true, 'Link is required'],
  },
  status: {
    type: Number,
    default: 1
  },
}, {
  timestamps: true
})

module.exports = model("page", PageModel)