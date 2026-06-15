const errorHandler = (error, req, res, next) => {
    // Mantiene nel terminale il dettaglio completo dell'errore.
    console.error(`${req.method} ${req.originalUrl}:`, error)

    let statusCode = error.statusCode || 500

    // Converte gli errori di validazione di Mongoose in richieste non valide.
    if (error.name === "ValidationError" || error.name === "CastError") {
        statusCode = 400
        error.message = "Compila correttamente tutti i campi obbligatori"
    }

    if (error.code === 11000) {
        statusCode = 409
        error.message = "Esiste già un utente registrato con questa email"
    }

    res.status(statusCode).json({
        statusCode,
        message: statusCode === 500 ? "Internal Server Error" : error.message
    })
}

module.exports = errorHandler
