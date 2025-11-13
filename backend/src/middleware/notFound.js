// backend/src/middleware/notFound.js
// 404 handler for unknown routes

module.exports = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};
