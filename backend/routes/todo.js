var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const Todo = require("../models/todo");
const Coloc = require("../models/coloc");
const User = require("../models/users");

//ROUTE GET : RECUP TOUT LES TODO DE L'UTILISATEUR
router.get("/recuptodo/:userToken", (req, res) => {
  const userToken = req.params.userToken;

  if (!userToken) {
    return res.json({ result: false, error: "Token manquant" });
  }

  // D'abord, on trouve l'utilisateur avec le token
  User.findOne({ token: userToken }).then((user) => {
    if (!user) {
      return res.json({ result: false, error: "Utilisateur non trouvé" });
    }

    // Ensuite, on cherche toutes les todos où l'utilisateur est participant
    Todo.find({ participants: user._id })
      .populate("participants")
      .then((todos) => {
        res.json({ result: true, todos });
      });
  });
});

// route Post pour créer une tache :
router.post("/createtodo", (req, res) => {
  console.log("route");
  const { participants, colocToken, tâche, date, récurrence } = req.body;

  if (!participants || !colocToken || !tâche || !date || !récurrence) {
    return res.json({ result: false, error: "Tous les champs sont requis" });
  }

  // Convertir la date en objet Date
  const initialDate = new Date(date);

  // Calcul de nextOccurrence en fonction de la récurrence
  let nextOccurrence = null;
  if (récurrence === "Hebdomadaire") {
    // Si récurrence hebdomadaire, ajouter 7 jours à la date initiale
    nextOccurrence = new Date(initialDate);
    nextOccurrence.setDate(nextOccurrence.getDate() + 7);
  } else if (récurrence === "Mensuelle") {
    // Si récurrence mensuelle, ajouter 1 mois
    nextOccurrence = new Date(initialDate);
    nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
  } else {
    // Si la récurrence n'est pas reconnue, laisse nextOccurrence à null
    nextOccurrence = null;
  }

  // Créer un nouvel objet Todo
  const newTodo = new Todo({
    participants,
    colocToken,
    date: initialDate,
    récurrence,
    tâche,
    nextOccurrence,
  });

  newTodo
    .save()
    .then((newDoc) => {
      res.json({ result: true, todo: newDoc });
    })
    .catch((error) => {
      console.error(error);
      res.json({
        result: false,
        error: "Erreur lors de la création de la tâche",
      });
    });
});

//route Post pour update la todo
router.post("/update/:todoId", async (req, res) => {
  const todoId = req.params.todoId;
  const nextOccurrence = req.body.nextOccurrence; // La prochaine date d'occurrence

  try {
    // Trouver la tâche par son ID
    const todo = await Todo.findById(todoId);
    if (!todo) {
      res.json({ result: false, error: "Tâche non trouvée" });
      return;
    }

    // Calculer la prochaine occurrence pour la tâche récurrente
    if (todo.récurrence) {
      // Convertir la chaîne de caractère en objet Date
      const nextOccurrenceDate = new Date(nextOccurrence);

      // Vérifier que la date est valide
      if (isNaN(nextOccurrenceDate)) {
        return res.json({
          result: false,
          error: "La date de la prochaine occurrence est invalide",
        });
      }

      // Mettre à jour la tâche avec la nouvelle prochaine occurrence
      todo.nextOccurrence = nextOccurrenceDate; // Enregistrez la nouvelle date d'occurrence

      await todo.save();

      return res.json({
        result: true,
        message: "Tâche mise à jour avec la prochaine occurrence",
        todo,
      });
    } else {
      return res.json({
        result: false,
        error: "Cette tâche n'est pas récurrente",
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      result: false,
      error: "Erreur lors de la mise à jour de la tâche",
    });
  }
});

module.exports = router;
