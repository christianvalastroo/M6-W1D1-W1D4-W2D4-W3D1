const jwt = require("jsonwebtoken")
const Author = require("../authors/authors.schema")
const { sendEmail } = require("../email/email.service")
const AppError = require("../../exceptions/AppError")

const {
    hashPassword,
    comparePassword
} = require("./password/password.service")

const register = async (authorData) => {
    const requiredFields = ["nome", "cognome", "email", "password"]
    const hasEmptyFields = requiredFields.some(
        field => (
            typeof authorData[field] !== "string"
            || !authorData[field].trim()
        )
    )

    if (hasEmptyFields) {
        throw new AppError(400, "Compila tutti i campi obbligatori")
    }

    if (authorData.password.length < 8) {
        throw new AppError(400, "La password deve contenere almeno 8 caratteri")
    }

    const normalizedEmail = authorData.email.trim().toLowerCase()
    const hashedPassword = await hashPassword(authorData.password)

    const newAuthor = new Author({
        nome: authorData.nome.trim(),
        cognome: authorData.cognome.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        dataDiNascita: authorData.dataDiNascita,
        avatar: authorData.avatar
    })

    const savedAuthor = await newAuthor.save()

    try {
        await sendEmail(
            savedAuthor.email,
            "Benvenuto su Strive Blog",
            `Ciao ${savedAuthor.nome}, la tua registrazione è avvenuta con successo!`
        )
    } catch (error) {
        // L'invio dell'email non deve annullare una registrazione già completata.
        console.error("Email di benvenuto non inviata:", error.message)
    }

    const author = savedAuthor.toObject()
    delete author.password

    return author
}

const login = async (email, password) => {
    if (typeof email !== "string" || !email.trim() || !password) {
        throw new AppError(400, "Email e password sono obbligatorie")
    }

    const author = await Author.findOne({
        email: email.trim().toLowerCase()
    }).select("+password")

    if (!author) {
        throw new AppError(401, "Email/password sbagliata")
    }

    const isPasswordCorrect = await comparePassword(
        password,
        author.password
    )

    if (!isPasswordCorrect) {
        throw new AppError(401, "Email/password sbagliata")
    }

    const token = jwt.sign(
        {
            id: author._id,
            email: author.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    )

    return token
}

module.exports = {
    register,
    login
}
