const AppError = require("../../exceptions/AppError")

const isAdminMiddleware = (req, res, next) => {
    if (!req.author) {
        return next(new AppError(401, "Autenticazione richiesta"))
    }

    if (req.author.role !== "admin") {
        return next(new AppError(403, "Permessi amministratore richiesti"))
    }

    next()
}

module.exports = isAdminMiddleware
