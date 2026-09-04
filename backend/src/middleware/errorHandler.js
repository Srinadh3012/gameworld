const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }
  
  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  }
  
  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found or invalid ID format';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    // Do not expose stack traces in responses
  });
};

module.exports = { errorHandler };
