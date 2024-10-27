const mongoose = require("mongoose");
const {Schema} = require("mongoose");

// Namely course  1, 2, 3, 4
const LevelSchema = new Schema({

});


module.exports = mongoose.model("level", LevelSchema);

