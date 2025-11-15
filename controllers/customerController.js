const mongoose = require("mongoose");
const Customer = require("../models/Customers");

exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    return res.status(201).json({ status: "success", data: customer });
  } catch (err) {
    next(err);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ status: "success", results: customers.length, data: customers });
  } catch (err) {
    next(err);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid customer id" });
    const customer = await Customer.findById(id);
    if (!customer)
      return res
        .status(404)
        .json({ status: "fail", message: "Customer not found" });
    return res.status(200).json({ status: "success", data: customer });
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid customer id" });
    const customer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer)
      return res
        .status(404)
        .json({ status: "fail", message: "Customer not found" });
    return res.status(200).json({ status: "success", data: customer });
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid customer id" });
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer)
      return res
        .status(404)
        .json({ status: "fail", message: "Customer not found" });
    return res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
};
