const errorHandler = (error, req, res, next) => {
    // Mantiene nel terminale il dettaglio completo dell'errore.
    console.error(`${req.method} ${req.originalUrl}:`, error)

    let statusCode = error.statusCode || 500

    // Converte gli errori di validazione di Mongoose in richieste non valide.
    if (error.name === "ValidationError" || error.name === "CastError") {
        statusCode = 400
    }

    if (error.code === 11000) {
        statusCode = 409
    }

    res.status(statusCode).json({
        statusCode,
        message: statusCode === 500 ? "Internal Server Error" : error.message
    })
}

module.exports = errorHandler
