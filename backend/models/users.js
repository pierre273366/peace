const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  google_id: String,
  token: String,
  phonenumber: Number,
  dateofbirth: String,
  firstcoloc: String,
  profilpicture: String,
  arrivaldate: Date,
  description: String,
  colocToken: String,
  colocname: String, 
  badgeearned: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
