var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Tricount = require('../models/tricount');
const Coloc = require('../models/coloc');




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


//ROUTE GET : AVOIR TOUS LES USERS DE LA COLOC
router.get('/coloc/:id/users', async (req, res) => {
    const coloc = await Coloc.findById(req.params.id)
        .populate('users')
        .select('users');

    if (!coloc) {
        return res.json({ message: 'Colocation non trouvée' });
    }

    res.json({ users: coloc.users });
});


module.exports = router;
