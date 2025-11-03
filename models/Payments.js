const mongoose = require("mongoose");

// Payments Schema - history of customer payments
// Fields: CustomerID, InvoiceID (optional), PaymentDate, Amount, PaymentType, Notes, CreatedBy
const paymentSchema = new mongoose.Schema(
  {
    CustomerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    InvoiceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: false,
      index: true,
    },
    PaymentDate: { type: Date, required: true, default: Date.now },
    Amount: { type: Number, required: true, min: 0 },
    PaymentType: {
      type: String,
      required: true,
      // standardized enum across models
      enum: ["Cash", "Card", "Transfer", "Debt", "Other"],
    },
    Notes: { type: String, required: false },
  },
  { timestamps: true }
);

// Helpful indexes for queries by customer and invoice
paymentSchema.index({ CustomerID: 1, PaymentDate: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
