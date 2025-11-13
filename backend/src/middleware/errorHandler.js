// backend/src/middleware/errorHandler.js
// Centralized error handling middleware

module.exports = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const isMulter = err.name === 'MulterError' || /multer/i.test(String(err.stack || ''));
  const finalStatus = isMulter && status === 500 ? 400 : status;

  const payload = {
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  res.status(finalStatus).json(payload);
};
