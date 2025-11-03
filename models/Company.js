const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Location: { type: String, required: false },
    Industry: { type: String, required: false },
    Phone: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
