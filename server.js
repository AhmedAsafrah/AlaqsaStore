const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Routes
const customersRouter = require("./routes/customers");
const productsRouter = require("./routes/products");
const companiesRouter = require("./routes/companies");

dotenv.config();

const dbConnection = require("./config/database");
const AppError = require("./utils/appError");
const globalError = require("./middleware/globalError");
const invoicesRouter = require("./routes/invoices");
const invoiceDetailsRouter = require("./routes/invoiceDetails");

// Connect to Database
dbConnection();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/companies", companiesRouter);
app.use("/api/v1/customers", customersRouter);
app.use("/api/v1/invoices", invoicesRouter);
app.use("/api/v1/invoicedetails", invoiceDetailsRouter);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Catch all wrong routes (using middleware)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling Middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Server closed _--_");
    process.exit(1);
  });
});
