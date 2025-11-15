const express = require("express");
const invoiceController = require("../controllers/invoiceController");

const router = express.Router();

router
  .route("/")
  .get(invoiceController.getInvoices)
  .post(invoiceController.createInvoice);
// transactional creation
router.post("/transaction", invoiceController.createInvoiceWithDetails);
router
  .route("/:id")
  .get(invoiceController.getInvoice)
  .patch(invoiceController.updateInvoice)
  .delete(invoiceController.deleteInvoice);

// recalculate total for an invoice
router.post("/:id/recalculate", invoiceController.recalculateInvoiceTotal);

module.exports = router;
