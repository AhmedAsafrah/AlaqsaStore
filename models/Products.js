const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    SellingPrice: { type: Number, required: true },
    QuantityInStock: { type: Number, required: true },

    Suppliers: [
      {
        CompanyID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
          required: false,
        },
        CompanyName: { type: String, required: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
