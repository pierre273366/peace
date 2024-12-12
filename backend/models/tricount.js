const mongoose = require("mongoose");

// Share Schema
const shareSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  amountToPay: { type: Number, required: true } // Ajout du montant à payer
});

// Expense Schema
const expenseSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // champs obligatoire
  amount: { type: Number, required: true, min: 0 }, // Valeur Minimal Autorisée
  description: { type: String, required: true },
  expense_date: { type: Date, default: Date.now },
  share: [shareSchema], // Tableau si plusieurs utilisateurs peuvent être impliqués
});

// Tricount Schema
const tricountSchema = mongoose.Schema({
  colocToken: String,
  title: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  expense: [expenseSchema], // Tableau si plusieurs dépenses sont associées au même tricount
}, { timestamps: true });

// Modèle
const Tricount = mongoose.model("tricounts", tricountSchema);

module.exports = Tricount;
