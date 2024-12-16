const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    isUrgent: {
      type: Boolean,
      default: false
    },
    colocToken:String,
    completed: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true
  });

const Product = mongoose.model("products", productSchema);

module.exports = Product;
