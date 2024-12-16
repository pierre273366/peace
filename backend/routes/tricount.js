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



//ROUTE GET : RECUP LES UTILISATEUR D'UN TRICOUNT
router.get('/tricount-participants/:tricountId', (req, res) => {
  const { tricountId } = req.params;

  if (!tricountId) {
    return res.json({ result: false, error: 'ID du tricount requis' });
  }

  Tricount.findById(tricountId)
    .populate('participants', ['username', '_id']) // On ne récupère que username et _id des participants
    .then(data => {
      if (data && data.participants) {
        res.json({ result: true, participants: data.participants });
      } else {
        res.json({ result: false, error: 'Tricount non trouvé' });
      }
    });
});



//ROUTE POST : AJOUT D'UNE DEPENSe
router.post('/add-expense', (req, res) => {
  console.log('Données reçues:', req.body); // Pour débugger

  const { tricountId, expense } = req.body;

  if (!tricountId || !expense) {
    return res.json({ result: false, error: 'Données manquantes' });
  }

  Tricount.findByIdAndUpdate(
    tricountId,
    { $push: { expense: expense } },
    { new: true }
  )
  .then(updatedTricount => {
    if (updatedTricount) {
      res.json({ result: true, tricount: updatedTricount });
    } else {
      res.json({ result: false, error: 'Tricount non trouvé' });
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    res.status(500).json({ result: false, error: error.message });
  });
});



//ROUTE GET: RECUPÈRE TOUTES LES DEPENSES
router.get('/tricountExpense/:tricountId', (req, res) => {
  const { tricountId } = req.params;

  if (!tricountId) {
    return res.json({ result: false, error: 'ID du tricount requis' });
  }

  Tricount.findById(tricountId)
    .populate({
      path: 'expense.user',    // Pour avoir les infos de l'utilisateur qui a payé
      select: 'username'       // On ne récupère que le username
    })
    .populate({
      path: 'expense.share.user', // Pour avoir les infos des utilisateurs dans les shares
      select: 'username'
    })
    .then(tricount => {
      if (tricount) {
        // On peut directement renvoyer le tricount avec toutes ses dépenses
        res.json({
          result: true,
          tricount: {
            _id: tricount._id,
            title: tricount.title,
            expense: tricount.expense.map(exp => ({
              description: exp.description,
              amount: exp.amount,
              expense_date: exp.expense_date,
              user: exp.user,
              share: exp.share
            }))
          }
        });
      } else {
        res.json({ result: false, error: 'Tricount non trouvé' });
      }
    });
});




//ROUTE GET : AVOIR ID PAR TOKEN
router.get('/user/:token', (req, res) => {
  const { token } = req.params;

  // Vérification de la présence du token
  if (!token) {
    return res.json({ result: false, error: 'Token manquant' });
  }

  // Recherche de l'utilisateur par son token
  User.findOne({ token: token })
    .then(data => {
      if (data) {
        res.json({ result: true, userId: data._id });
      } else {
        res.json({ result: false, error: 'Utilisateur non trouvé' });
      }
    });
});



//ROUTE GET : AVOIR UN TOTAL PAR UTILISATEUR
router.get('/balances/:id', async (req, res) => {
  const tricountId = req.params.id;

  try {
    const tricount = await Tricount.findById(tricountId)
      .populate({
        path: 'expense',
        populate: [
          { path: 'user', select: 'username' },
          { path: 'share.user', select: 'username' }
        ]
      });

    const balances = {};

    // Pour chaque dépense
    tricount.expense.forEach(expense => {
      // Ajoute le montant payé pour le payeur
      if (!balances[expense.user._id]) {
        balances[expense.user._id] = {
          userId: expense.user._id,
          username: expense.user.username,
          balance: 0
        };
      }
      balances[expense.user._id].balance += expense.amount;

      // Soustrait les montants à payer pour chaque participant
      expense.share.forEach(share => {
        if (!balances[share.user._id]) {
          balances[share.user._id] = {
            userId: share.user._id,
            username: share.user.username,
            balance: 0
          };
        }
        balances[share.user._id].balance -= share.amountToPay;
      });
    });

    // Convertit l'objet en tableau
    const balancesArray = Object.values(balances);
    
    res.json({ 
      result: true, 
      balances: balancesArray 
    });

  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});





//ROUTE DELETE : RETIRE L'UTILISATEUR DU TRICOUNT (LE SUPPRIME SI C'EST LE DERNIER)
router.delete('/delete/:tricountId', (req, res) => {
 
  
  if (!req.body.token) {
    return res.json({ result: false, error: 'Token manquant' });
  }

  User.findOne({ token: req.body.token })
    .then(user => {
      if (!user) {
        return res.json({ result: false, error: 'Utilisateur non autorisé' });
      }

      Tricount.findById(req.params.tricountId)
        .then(tricount => {
          if (!tricount) {
            return res.json({ result: false, error: 'Tricount non trouvé' });
          }

          // Retire l'utilisateur des participants
          const updatedParticipants = tricount.participants.filter(
            participant => participant.toString() !== user._id.toString()
          );

          // Si c'était le dernier participant, supprime le tricount
          if (updatedParticipants.length === 0) {
            Tricount.deleteOne({ _id: req.params.tricountId })
              .then(() => {
                res.json({ result: true, message: 'Tricount supprimé car plus aucun participant' });
              });
          } else {
            // Sinon, met à jour la liste des participants
            Tricount.updateOne(
              { _id: req.params.tricountId },
              { $set: { participants: updatedParticipants } }
            )
              .then(() => {
                res.json({ result: true, message: 'Vous avez quitté le tricount' });
              });
          }
        });
    });
});

module.exports = router;
