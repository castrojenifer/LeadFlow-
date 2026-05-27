// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error Catch-all:');
  console.error(err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
