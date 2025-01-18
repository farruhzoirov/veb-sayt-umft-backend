const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const StructureType = new Schema({
  code: String,
  name: String,
})

// hemisId is departmentId in the hemis.
const DepartmentSchema = new Schema({
  code: {
    type: String,
  },
  hemisId: {
    type: Number,
  },
  slug: {
    type: String,
  },
  img: [],
  structureType: StructureType,
  active: {
    type: Boolean,
    default: true,
  },
  status: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("department", DepartmentSchema);

