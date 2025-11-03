const mongoose = require("mongoose");

const companyPurchaseDetailsSchema = new mongoose.Schema(
  {
    PurchaseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyPurchase",
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

// indexes for faster lookup
companyPurchaseDetailsSchema.index({ PurchaseID: 1 });
companyPurchaseDetailsSchema.index({ ProductID: 1 });

// virtual for line total
companyPurchaseDetailsSchema.virtual("lineTotal").get(function () {
  return this.Quantity * this.UnitPrice;
});
companyPurchaseDetailsSchema.set("toObject", { virtuals: true });
companyPurchaseDetailsSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model(
  "CompanyPurchaseDetail",
  companyPurchaseDetailsSchema
);
