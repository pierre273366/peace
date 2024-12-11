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
    const { title, participants, colocId } = req.body;
  
    const newTricount = new Tricount({
      coloc: colocId,
      title: title,
      participants: participants,
      expense: [] // Tableau vide au départ
    });
  
    newTricount.save()
      .then(newDoc => {
        res.json({ result: true, tricount: newDoc });
      });
  });





module.exports = router;
