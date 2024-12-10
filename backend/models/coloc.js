const mongoose = require("mongoose");

const colocSchema = mongoose.Schema({
  name: String,
  peoples: Number,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const Coloc = mongoose.model("colocs", colocSchema);

module.exports = Coloc;
