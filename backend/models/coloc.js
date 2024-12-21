const mongoose = require("mongoose");

const colocSchema = mongoose.Schema({
  name: String,
  peoples: Number,
  address: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  token: String,
  sondages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sondage" }],
  codeWifi: String,
  loyer: Number,
  infoVoisinage: String,
  regleColoc: String,
});

const Coloc = mongoose.model("colocs", colocSchema);

module.exports = Coloc;
