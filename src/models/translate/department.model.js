const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const DepartmentTranslateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  text: {
    type: String
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "department",
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: "language",
  }
}, {
  timestamps: true
});


module.exports = mongoose.model("departmentTranslate", DepartmentTranslateSchema);

