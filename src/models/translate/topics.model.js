const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const TopicTranslateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String
  },
  description: {
    type: String,
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: "topic",
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: "language",
    required: true,
  },
}, {
  timestamps: true
});


module.exports = mongoose.model("topicTranslate", TopicTranslateSchema);

