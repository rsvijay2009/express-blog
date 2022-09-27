const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        'code' : statusCode,
        'stackTrace': (process.env.NODE_ENV == 'development') ? err.stack: null
    })
}

module.exports = {
    errorHandler
}