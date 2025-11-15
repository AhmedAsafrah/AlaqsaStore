const mongoose = require("mongoose");
const Company = require("../models/Company");

exports.createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    return res.status(201).json({ status: "success", data: company });
  } catch (err) {
    next(err);
  }
};

exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ status: "success", results: companies.length, data: companies });
  } catch (err) {
    next(err);
  }
};

exports.getCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid company id" });
    const company = await Company.findById(id);
    if (!company)
      return res
        .status(404)
        .json({ status: "fail", message: "Company not found" });
    return res.status(200).json({ status: "success", data: company });
  } catch (err) {
    next(err);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid company id" });
    const company = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!company)
      return res
        .status(404)
        .json({ status: "fail", message: "Company not found" });
    return res.status(200).json({ status: "success", data: company });
  } catch (err) {
    next(err);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid company id" });
    const company = await Company.findByIdAndDelete(id);
    if (!company)
      return res
        .status(404)
        .json({ status: "fail", message: "Company not found" });
    return res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
};
