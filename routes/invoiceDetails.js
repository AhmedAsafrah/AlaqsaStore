const express = require("express");
const invoiceDetailController = require("../controllers/invoiceDetailController");

const router = express.Router();

router
  .route("/")
  .get(invoiceDetailController.getInvoiceDetails)
  .post(invoiceDetailController.createInvoiceDetail);
router
  .route("/:id")
  .get(invoiceDetailController.getInvoiceDetail)
  .patch(invoiceDetailController.updateInvoiceDetail)
  .delete(invoiceDetailController.deleteInvoiceDetail);

module.exports = router;
