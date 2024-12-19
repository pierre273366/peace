const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  colocToken: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  tâche: String,
  date: Date,
  récurrence: String,
  nextOccurrence: { type: Date },
  completed: {
    type: Boolean,
    default: false,
  },
  completedTomorrow: {
    type: Boolean,
    default: false,
  },
  completedHebdomadaire: {
    type: Boolean,
    default: false,
  },
  completedMensuel: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model("todos", todoSchema);

module.exports = Todo;
