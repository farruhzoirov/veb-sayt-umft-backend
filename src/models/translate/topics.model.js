const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const TopicTranslateSchema = new Schema({
   name: {
       type: String,
       required: true,
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
});


module.exports = mongoose.model("topicTranslate", TopicTranslateSchema);

