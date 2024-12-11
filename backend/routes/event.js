var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const Event = require("../models/event");

// Route pour récupérer les événements
router.get("/", (req, res) => {
  res.json({ events }); // Récupère tous les événements
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
    coloc_id,
  });
  newEvent.save().then(() => {
    res.json({ newEvent }); // Retourne l'événement créé
  });
});

module.exports = router;
