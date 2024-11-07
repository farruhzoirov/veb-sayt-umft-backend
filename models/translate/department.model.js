const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const DepartmentTranslateSchema = new Schema({
   name: {
       type: String,
       required: true,
   },
    department: {
       type: Schema.Types.ObjectId,
        ref: "department",
    },
    language: {
       type: Schema.Types.ObjectId,
        ref: "language",
    }
});


module.exports = mongoose.model("departmentTranslate", DepartmentTranslateSchema);

