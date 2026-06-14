const jwt = require("jsonwebtoken")
const Author = require("../authors/authors.schema")
const { sendEmail } = require("../email/email.service")

const {
    hashPassword,
    comparePassword
} = require("./password/password.service")

const register = async (authorData) => {
    const hashedPassword = await hashPassword(authorData.password)

    const newAuthor = new Author({
        ...authorData,
        password: hashedPassword
    })

    const savedAuthor = await newAuthor.save()

    await sendEmail(
        savedAuthor.email,
        "Benvenuto su Strive Blog",
        `Ciao ${savedAuthor.nome}, la tua registrazione è avvenuta con successo!`
    )

    return savedAuthor
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