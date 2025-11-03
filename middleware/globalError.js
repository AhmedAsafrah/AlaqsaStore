// Basic global error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // In production you'd hide stack traces and internal details
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
