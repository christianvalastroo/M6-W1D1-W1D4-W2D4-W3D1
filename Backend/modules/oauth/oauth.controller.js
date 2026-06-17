const jwt = require("jsonwebtoken")

const googleCallback = (req, res) => {
    const author = req.user

    const token = jwt.sign(
        {
            id: author._id.toString(),
            email: author.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    )

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"

    res.redirect(`${frontendUrl}/login?token=${token}`)
}

module.exports = {
    googleCallback
}
