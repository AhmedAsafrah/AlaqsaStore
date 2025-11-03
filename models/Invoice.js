const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    CustomerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    InvoiceDate: { type: Date, required: true, default: Date.now },
    TotalAmount: { type: Number, required: true, min: 0 },
    PaymentType: {
      type: String,
      required: true,
      // standardized enum
      enum: ["Cash", "Card", "Transfer", "Debt", "Other"],
    },
  },
  { timestamps: true }
);

// virtual to populate invoice details
invoiceSchema.virtual("Details", {
  ref: "InvoiceDetail",
  localField: "_id",
  foreignField: "InvoiceID",
});
invoiceSchema.set("toObject", { virtuals: true });
invoiceSchema.set("toJSON", { virtuals: true });

// cascade delete invoice details when an Invoice is deleted
invoiceSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const InvoiceDetail = require("./InvoiceDetails");
    await InvoiceDetail.deleteMany({ InvoiceID: doc._id });
  }
});

module.exports = mongoose.model("Invoice", invoiceSchema);
