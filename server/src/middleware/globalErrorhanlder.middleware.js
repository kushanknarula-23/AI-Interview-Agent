const globalErrorHanlder = async (err, req, res, next) => {
    const statusCode = err.statuscode || 500;

    // Only log server stack traces for 500+ internal errors, not expected 4xx auth/validation responses
        console.error("=== SERVER ERROR ===");
        console.error("Message:", err.message);
        console.error("Stack:", err.stack);
        console.error("===================");

    res.status(statusCode).json({
        statuscode: statusCode,
        message: err.message
    });
};

export default globalErrorHanlder;