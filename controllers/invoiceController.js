const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");
const InvoiceDetail = require("../models/InvoiceDetails");

// Create invoice (simple)
exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body);
    return res.status(201).json({ status: "success", data: invoice });
  } catch (err) {
    next(err);
  }
};

// Create invoice + details transactionally and compute total
exports.createInvoiceWithDetails = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { CustomerID, PaymentType, items } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      throw new Error("Invoice must include at least one item");

    // create invoice header with temporary total 0
    const [invoice] = await Invoice.create(
      [{ CustomerID, PaymentType, TotalAmount: 0 }],
      { session }
    );

    // prepare details
    const details = items.map((i) => ({
      InvoiceID: invoice._id,
      ProductID: i.ProductID,
      Quantity: i.Quantity,
      UnitPrice: i.UnitPrice,
    }));

    await InvoiceDetail.insertMany(details, { session });

    // compute total
    const total = details.reduce((s, d) => s + d.Quantity * d.UnitPrice, 0);
    invoice.TotalAmount = total;
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    // populate details for response
    const populated = await Invoice.findById(invoice._id).populate({
      path: "Details",
      populate: { path: "ProductID" },
    });
    return res.status(201).json({ status: "success", data: populated });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ status: "success", results: invoices.length, data: invoices });
  } catch (err) {
    next(err);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid invoice id" });
    const invoice = await Invoice.findById(id).populate({
      path: "Details",
      populate: { path: "ProductID" },
    });
    if (!invoice)
      return res
        .status(404)
        .json({ status: "fail", message: "Invoice not found" });
    return res.status(200).json({ status: "success", data: invoice });
  } catch (err) {
    next(err);
  }
};

// Recalculate an invoice's total from its details
exports.recalculateInvoiceTotal = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid invoice id" });

    const invoice = await Invoice.findById(id).session(session);
    if (!invoice)
      return res
        .status(404)
        .json({ status: "fail", message: "Invoice not found" });

    const details = await InvoiceDetail.find({ InvoiceID: id }).session(
      session
    );
    const total = details.reduce((s, d) => s + d.Quantity * d.UnitPrice, 0);
    invoice.TotalAmount = total;
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await Invoice.findById(id).populate({
      path: "Details",
      populate: { path: "ProductID" },
    });
    return res.status(200).json({ status: "success", data: populated });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid invoice id" });
    const invoice = await Invoice.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!invoice)
      return res
        .status(404)
        .json({ status: "fail", message: "Invoice not found" });
    return res.status(200).json({ status: "success", data: invoice });
  } catch (err) {
    next(err);
  }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid invoice id" });
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice)
      return res
        .status(404)
        .json({ status: "fail", message: "Invoice not found" });
    return res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
};
