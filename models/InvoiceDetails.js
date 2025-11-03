const mongoose = require("mongoose");

// Invoice Details Schema
// Fields: InvoiceID, ProductID, Quantity, UnitPrice
const invoiceDetailsSchema = new mongoose.Schema(
  {
    InvoiceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    ProductID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    Quantity: { type: Number, required: true, min: 1 },
    UnitPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// index for fast lookup by invoice and product
invoiceDetailsSchema.index({ InvoiceID: 1 });
invoiceDetailsSchema.index({ ProductID: 1 });

// virtual for line total
invoiceDetailsSchema.virtual("lineTotal").get(function () {
  return this.Quantity * this.UnitPrice;
});
invoiceDetailsSchema.set("toObject", { virtuals: true });
invoiceDetailsSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("InvoiceDetail", invoiceDetailsSchema);
