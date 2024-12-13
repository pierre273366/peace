var express = require("express");
var router = express.Router();
require("../models/connection");
const Sondage = require("../models/sondage");
const Coloc = require("../models/coloc");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");





router.post("/createSondage", (req, res) => {

    const { userToken, colocToken, title, responses } = req.body;

    // On vérifie si les champs "username" et "password" sont présents dans le corps de la requête.
    if (!checkBody(req.body, ["title", "responses"])) {
      res.json({ result: false, error: "Missing or empty fields" });
      // Si des champs sont manquants ou vides, on renvoie une erreur avec un message.
      return;
    }

    const user = User.findOne({ token: userToken });
    if (!user) {
      return res.json({ result: false, error: "Token utilisateur invalide" });
    }

    const coloc = Coloc.findOne({ token: colocToken });
    if (!coloc) {
      return res.json({ result: false, error: "Token coloc invalide" });
    }

// On cherche si un sondage avec le même titre existe déjà.
Sondage.findOne({ title: req.body.title }).then((sondage) => {
    if (sondage === null) {
      // Si aucun sondage n'est trouvé avec ce titre :

      // Créer un nouveau sondage pour l'utilisateur
      const newSondage = new Sondage({
        title: title,
        responses: responses,
        user: userToken, 
        colocToken: colocToken,
      });

      // Enregistre le sondage dans la base de données
      newSondage.save()
      .then(() => res.json({ result: true, message: 'Sondage créé avec succès' }))
    }else{
        res.json({ result: false, error: "Un sondage avec ce titre existe déjà" });
    }
}
)}
);

router.get("/getSondages", (req, res) => {
    Sondage.find() // Récupérer tous les sondages
      .then((sondages) => {
        res.json({ result: true, sondages });
      });
  });







module.exports = router;
