const mongoose = require("mongoose");

// Company Purchases Schema
// Fields: CompanyID, PurchaseDate, TotalAmount, PaymentType, Notes
const companyPurchasesSchema = new mongoose.Schema(
  {
    CompanyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    PurchaseDate: { type: Date, required: true, default: Date.now },
    TotalAmount: { type: Number, required: true, min: 0 },
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

module.exports = mongoose.model("CompanyPurchase", companyPurchasesSchema);

// virtual to populate purchase details
companyPurchasesSchema.virtual("Details", {
  ref: "CompanyPurchaseDetail",
  localField: "_id",
  foreignField: "PurchaseID",
});
companyPurchasesSchema.set("toObject", { virtuals: true });
companyPurchasesSchema.set("toJSON", { virtuals: true });

// cascade delete purchase details when a CompanyPurchase is deleted
companyPurchasesSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const CompanyPurchaseDetail = require("./CompanyPurchaseDetails");
    await CompanyPurchaseDetail.deleteMany({ PurchaseID: doc._id });
  }
});
