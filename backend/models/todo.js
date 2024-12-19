const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  colocToken: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  tâche: String,
  date: Date,
  récurrence: String,
  nextOccurrence: { type: Date },
  completed: Boolean,
  completedTomorrow: Boolean,
  completedHebdomadaire: Boolean,
  completedMensuel: Boolean,
});

const Todo = mongoose.model("todos", todoSchema);

module.exports = Todo;
