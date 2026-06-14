const jwt = require("jsonwebtoken")
const Author = require("../../modules/authors/authors.schema")

const verifyToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization

        if (!authorization) {
            return res.status(401).json({
                statusCode: 401,
                message: "Token mancante"
            })
        }

        const token = authorization.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const author = await Author.findById(decoded.id)

        if (!author) {
            return res.status(404).json({
                statusCode: 404,
                message: "Autore non trovato"
            })
        }

        req.author = author
        next()

    } catch (error) {
        res.status(401).json({
            statusCode: 401,
            message: "Token non valido"
        })
    }
}

module.exports = verifyToken