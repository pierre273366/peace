var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Tricount = require('../models/tricount');
const Coloc = require('../models/coloc');
const User = require("../models/users"); 




//ROUTE GET : RÉCUPERE TOUS LES UTILISATEURS DE LA COLOC
router.get("/getcolocusers/:token", (req, res) => {
    // D'abord on trouve l'utilisateur avec son token
    User.findOne({ token: req.params.token })
      .then(user => {
        if (!user) {
          res.json({ result: false, error: "User not found" });
          return;
        }
        // Ensuite on utilise son colocToken pour trouver tous les users de la coloc
        User.find({ colocToken: user.colocToken })
          .select("username")
          .then((users) => {
            if (users.length > 0) {
              res.json({ result: true, users: users });
            } else {
              res.json({ result: false, error: "No users found for this coloc" });
            }
          });
      });
  });

  

  //ROUTE POST :  CREATION D'UN TRICOUNT
  router.post('/createtricount', (req, res) => {
    const { title, participants, colocToken } = req.body;
  
    if (!title || !participants || !colocToken) {
      return res.json({ result: false, error: 'Tous les champs sont requis' });
    }
  
    const newTricount = new Tricount({
      colocToken: colocToken,
      title: title,
      participants: participants,
      expense: []
    });
  
    newTricount.save().then(newDoc => {
      res.json({ result: true, tricount: newDoc });
    });
  });




//ROUTE GET : RECUP TOUT LES TRICOUNT DE L'UTILISATEUR
router.get('/recuptricounts/:userToken', (req, res) => {
  const userToken = req.params.userToken;

  if (!userToken) {
    return res.json({ result: false, error: 'Token manquant' });
  }

  // D'abord, on trouve l'utilisateur avec le token
  User.findOne({ token: userToken })
    .then(user => {
      if (!user) {
        return res.json({ result: false, error: 'Utilisateur non trouvé' });
      }

      // Ensuite, on cherche tous les tricounts où l'utilisateur est participant
      Tricount.find({ participants: user._id })
        .then(tricounts => {
          res.json({ result: true, tricounts });
        });
    });
});





module.exports = router;
