const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    SellingPrice: { type: Number, required: true },
    QuantityInStock: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
