const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  google_id: String,
  token: String,
  phonenumber: Number,
  dateofbirth: Date,
  firstcoloc: String,
  profilpicture: {
    type: String,
    default: "default-image-url",
  },
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
