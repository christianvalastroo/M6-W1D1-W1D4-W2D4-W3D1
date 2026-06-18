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

    // Dopo Google OAuth rimanda al frontend configurato nell'ambiente corrente.
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`)
}

module.exports = {
    googleCallback
}
