const mongoose = require("mongoose");
const InvoiceDetail = require("../models/InvoiceDetails");
const Invoice = require("../models/Invoice");

// Create invoice detail and update parent invoice total transactionally
exports.createInvoiceDetail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { InvoiceID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(InvoiceID))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid InvoiceID" });

    const detail = await new InvoiceDetail(req.body).save({ session });

    // recompute total
    const details = await InvoiceDetail.find({ InvoiceID }).session(session);
    const total = details.reduce((s, d) => s + d.Quantity * d.UnitPrice, 0);
    const invoice = await Invoice.findById(InvoiceID).session(session);
    if (invoice) {
      invoice.TotalAmount = total;
      await invoice.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({ status: "success", data: detail });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.getInvoiceDetails = async (req, res, next) => {
  try {
    const details = await InvoiceDetail.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ status: "success", results: details.length, data: details });
  } catch (err) {
    next(err);
  }
};

exports.getInvoiceDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid detail id" });
    const detail = await InvoiceDetail.findById(id);
    if (!detail)
      return res
        .status(404)
        .json({ status: "fail", message: "Invoice detail not found" });
    return res.status(200).json({ status: "success", data: detail });
  } catch (err) {
    next(err);
  }
};

// Update invoice detail and adjust parent invoice totals (transactional)
exports.updateInvoiceDetail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid detail id" });

    const detail = await InvoiceDetail.findById(id).session(session);
    if (!detail)
      return res
        .status(404)
        .json({ status: "fail", message: "Invoice detail not found" });

    const oldInvoiceId = detail.InvoiceID ? detail.InvoiceID.toString() : null;

    // apply updates
    Object.assign(detail, req.body);
    await detail.save({ session });

    const newInvoiceId = detail.InvoiceID ? detail.InvoiceID.toString() : null;

    // recompute totals for affected invoices (old and new if changed)
    const recompute = async (invId) => {
      if (!invId) return;
      const dets = await InvoiceDetail.find({ InvoiceID: invId }).session(
        session
      );
      const total = dets.reduce((s, d) => s + d.Quantity * d.UnitPrice, 0);
      const invoice = await Invoice.findById(invId).session(session);
      if (invoice) {
        invoice.TotalAmount = total;
        await invoice.save({ session });
      }
    };

    await recompute(oldInvoiceId);
    if (newInvoiceId && newInvoiceId !== oldInvoiceId)
      await recompute(newInvoiceId);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ status: "success", data: detail });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

// Delete invoice detail and update parent invoice total transactionally
exports.deleteInvoiceDetail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid detail id" });
    const detail = await InvoiceDetail.findById(id).session(session);
    if (!detail)
      return res
        .status(404)
        .json({ status: "fail", message: "Invoice detail not found" });

    const invoiceId = detail.InvoiceID;
    await detail.deleteOne({ session });

    // recompute
    const details = await InvoiceDetail.find({ InvoiceID: invoiceId }).session(
      session
    );
    const total = details.reduce((s, d) => s + d.Quantity * d.UnitPrice, 0);
    const invoice = await Invoice.findById(invoiceId).session(session);
    if (invoice) {
      invoice.TotalAmount = total;
      await invoice.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return res.status(204).json({ status: "success", data: null });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
