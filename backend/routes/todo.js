var express = require("express");
var router = express.Router();

const Todo = require("../models/todo");
const Coloc = require("../models/coloc");
const User = require("../models/users");

// ROUTE GET : Récupérer tous les todos d'un utilisateur avec `completed`
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
        // On retourne les todos avec leur état 'completed'
        res.json({
          result: true,
          todos: todos.map((todo) => ({
            _id: todo._id,
            tâche: todo.tâche,
            date: todo.date,
            récurrence: todo.récurrence,
            participants: todo.participants,
            completed: todo.completed,
            completedTomorrow: todo.completedTomorrow,
            completedHebdomadaire: todo.completedHebdomadaire,
            completedMensuel: todo.completedMensuel,
            nextOccurrence: todo.nextOccurrence,
          })),
        });
      })
      .catch((error) => {
        res.json({
          result: false,
          error: "Erreur lors de la récupération des todos",
        });
      });
  });
});

// ROUTE POST : Créer une nouvelle tâche avec `completed` initialisé à `false`
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

  // Créer un nouvel objet Todo avec `completed` à false par défaut
  const newTodo = new Todo({
    participants,
    colocToken,
    date: initialDate,
    récurrence,
    tâche,
    completed: false, // Initialisation du champ completed à false
    completedTomorrow: false, // Initialisation du champ completed à false
    completedHebdomadaire: false, // Initialisation du champ completed à false
    completedMensuel: false, // Initialisation du champ completed à false
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

// ROUTE POST : Mettre à jour une tâche (incluant le champ `completed`)
router.post("/update/:todoId", async (req, res) => {
  const todoId = req.params.todoId;
  const {
    completed,
    completedTomorrow,
    completedHebdomadaire,
    completedMensuel,
    nextOccurrence,
  } = req.body; // Le champ completed et nextOccurrence

  try {
    // Trouver la tâche par son ID
    const todo = await Todo.findById(todoId);
    if (!todo) {
      res.json({ result: false, error: "Tâche non trouvée" });
      return;
    }

    // Mettre à jour l'état 'completed' de la tâche
    if (completed) {
      todo.completed = completed;
    }
    if (completedTomorrow) {
      todo.completedTomorrow = completedTomorrow;
    }
    if (completedHebdomadaire) {
      todo.completedHebdomadaire = completedHebdomadaire;
    }
    if (completedMensuel) {
      todo.completedMensuel = completedMensuel;
    }

    // Calculer la prochaine occurrence pour la tâche récurrente
    if (todo.récurrence && nextOccurrence) {
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
    }

    // Sauvegarder les changements
    await todo.save();

    res.json({
      result: true,
      message: "Tâche mise à jour avec succès",
      todo,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      result: false,
      error: "Erreur lors de la mise à jour de la tâche",
    });
  }
});

//ROUTE POUR DELETE UNE TACHE
router.delete("/delete/:todoId", async (req, res) => {
  if (!req.body.token) {
    return res.json({ result: false, error: "Token manquant" });
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (!user) {
      return res.json({ result: false, error: "Utilisateur non autorisé" });
    }

    Todo.findById(req.params.todoId).then((todo) => {
      if (!todo) {
        return res.json({ result: false, error: "Todo non trouvé" });
      }
      Todo.deleteOne({ _id: req.params.todoId }).then(() => {
        res.json({ result: true, message: "Tâche supprimée" });
      });
    });
  });
});

module.exports = router;
