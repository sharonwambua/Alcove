const errorHandler = (err, req, res, next) => {
 
  console.error(`[Server Error] ${err.message}`, err.stack);

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Error',
    
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFoundHandler };