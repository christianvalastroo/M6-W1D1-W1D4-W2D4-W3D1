const bcrypt = require("bcrypt")

const hashPassword = async (plainPassword) => {
    const hashedPassword = await bcrypt.hash(plainPassword, 10)
    return hashedPassword
}

const comparePassword = async (plainPassword, hashedPassword) => {
    const isPasswordCorrect = await bcrypt.compare(
        plainPassword,
        hashedPassword
    )

    return isPasswordCorrect
}

module.exports = {
    hashPassword,
    comparePassword
}