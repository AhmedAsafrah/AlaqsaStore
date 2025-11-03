const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Phone: { type: String, required: true },
    Email: { type: String, required: false, unique: true },
    Address: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
