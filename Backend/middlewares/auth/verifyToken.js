const jwt = require("jsonwebtoken")
const Author = require("../../modules/authors/authors.schema")

const verifyToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                statusCode: 401,
                message: "Token mancante"
            })
        }

        const token = authorization.slice(7).trim()

        if (!token) {
            return res.status(401).json({
                statusCode: 401,
                message: "Token mancante"
            })
        }

        // Verifica il token e recupera l'utente senza esporre la password.
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const author = await Author.findById(decoded.id).select("-password")

        if (!author) {
            return res.status(404).json({
                statusCode: 404,
                message: "Autore non trovato"
            })
        }

        // Rende l'autore disponibile ai controller delle route protette.
        req.author = author
        next()
    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            message: "Token non valido"
        })
    }
}

module.exports = verifyToken
