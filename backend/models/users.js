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
  arrivaldate: {
    type: Date,
    default: new Date().toISOString(),
  },
  description: String,
  colocToken: String,
  colocname: String,
  badgeearned: String,
  instagram: String,
  facebook: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
