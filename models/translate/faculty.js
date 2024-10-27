const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const FacultySchemaTranslate = new Schema({
   name: {
      type: String,
      required: true,
   },
    description: {
      type: String,
       required: true,
    },
   faculty: {
      type:  Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
   },
   language: {
      type: Schema.Types.ObjectId,
      ref: 'language',
      default:null,
   }
});
      

module.exports = mongoose.model("FacultyTranslate", FacultySchemaTranslate);

