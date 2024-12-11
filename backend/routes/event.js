var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const Event = require("../models/event");

// Route pour récupérer les événements
router.get("/event", async (req, res) => {
  try {
    const events = await Event.find(); // Récupérer tous les événements dans la base de données
    res.status().json(events); // Répondre avec les événements au format JSON
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    res.status().json({
      message: "Erreur lors de la récupération des événements",
      error,
    });
  }
});

// Route pour ajouter un événement
router.post("/", (req, res) => {
  const { name, time, place, description, date, coloc_id } = req.body;
  if (!name || !time || !place || !description || !date) {
    return res.json({ message: "Tous les champs sont requis" });
  }
  const newEvent = new Event({
    name,
    time,
    place,
    description,
    date,
  });
  newEvent.save().then(() => {
    res.json({ newEvent }); // Retourne l'événement créé
  });
});

module.exports = router;
