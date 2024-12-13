var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const Todo = require("../models/todo");
const Coloc = require("../models/coloc");
const User = require("../models/users");

router.post("/createtodo", (req, res) => {
  console.log("route");
  const { participants, colocToken, tâche, date, récurrence } = req.body;

  if (!participants || !colocToken || !tâche || !date || !récurrence) {
    return res.json({ result: false, error: "Tous les champs sont requis" });
  }

  const newTodo = new Todo({
    participants,
    colocToken,
    date,
    récurrence,
    tâche,
  });

  newTodo.save().then((newDoc) => {
    res.json({ result: true, todo: newDoc });
  });
});

module.exports = router;
