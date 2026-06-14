const authService = require("./auth.service")

const register = async (req, res, next) => {
    try {
        const savedAuthor = await authService.register(req.body)

        res.status(201).json({
            statusCode: 201,
            message: "Author registered",
            data: savedAuthor
        })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const token = await authService.login(email, password)

        res.status(200).json({
            statusCode: 200,
            message: "Login successful",
            token
        })
    } catch (error) {
        next(error)
    }
}

const me = async (req, res, next) => {
    try {
        res.status(200).json({
            statusCode: 200,
            message: "User profile",
            data: req.author
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register,
    login,
    me
}