const mongoose = require("mongoose");

const sondageSchema = mongoose.Schema({
  title: String,
  responses: [String],
  user: String,
  colocToken: String,
});

const Sondage = mongoose.model("sondages", sondageSchema);

module.exports = Sondage;
