var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Tricount = require('../models/tricount');



//ROUTE GET : RECUPERE TOUS LES TRICOUNT LIÉ A USER
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    const tricounts = await Tricount.find({ participants: new mongoose.Types.ObjectId(userId) });

    if (tricounts && tricounts.length > 0) { //Si Resultats >0 alors on affiche 
        res.json(tricounts);
    } else {
        res.json({ message: 'Pas de tricount.' });
    }
});


//ROUTE POST : CREATION D'UN TRICOUNT
router.post('/', async (req, res) => {
    // Récupération des données envoyées dans le corps de la requête
    const { title, participants  } = req.body;
  
    // Création du nouveau tricount
    const newTricount = new Tricount({
      title: title,
      participants: participants,  // tableau des ObjectIds des participants
    //  coloc: coloc,                 // ID de la coloc (si applicable)
      created_at: new Date(),
      updated_at: new Date()
    });
  
    // Sauvegarde du tricount dans la base de données
    const savedTricount = await newTricount.save();
  
    // Retourner le tricount créé
    res.json(savedTricount);
  });



module.exports = router;
