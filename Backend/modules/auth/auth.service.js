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
        field => !authorData[field]?.trim()
    )

    if (hasEmptyFields) {
        throw new AppError(400, "Compila tutti i campi obbligatori")
    }

    const hashedPassword = await hashPassword(authorData.password)

    const newAuthor = new Author({
        ...authorData,
        password: hashedPassword
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
    const author = await Author.findOne({ email })

    if (!author) {
        throw new Error("Author not found")
    }

    const isPasswordCorrect = await comparePassword(
        password,
        author.password
    )

    if (!isPasswordCorrect) {
        throw new Error("Password not valid")
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
