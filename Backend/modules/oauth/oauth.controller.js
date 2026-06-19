const jwt = require("jsonwebtoken")

const getFrontendUrl = () => process.env.FRONTEND_URL.replace(/\/+$/, "")

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
    res.redirect(`${getFrontendUrl()}/login?token=${encodeURIComponent(token)}`)
}

module.exports = {
    googleCallback
}
