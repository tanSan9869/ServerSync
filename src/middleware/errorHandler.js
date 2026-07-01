class AppError extends Error {
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

function errorHandler(err,req,res,next){
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Internal Server Error';

    console.error(`[error] ${req.method} ${req.path}:`,err.message);
    
    res.status(statusCode).json({
        success:false,
        error:message
    });   
}

// Catches errors in async route handlers without try/catch everywhere
function asyncHandler(fn){
    return (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
}

export {AppError, errorHandler, asyncHandler};