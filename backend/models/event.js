const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: String,
  time: Number,
  place: String,
  description: String,
  date: Date,
  coloc_id: { type: mongoose.Schema.Types.ObjectId, ref: "coloc" },
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
