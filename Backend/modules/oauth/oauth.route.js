const express = require("express")
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const oauthController = require("./oauth.controller")
const oauthService = require("./oauth.service")

const oauthRouter = express.Router()

const hasGoogleConfig = (
    process.env.GOOGLE_CLIENT_ID
    && process.env.GOOGLE_CLIENT_SECRET
    && process.env.GOOGLE_CALLBACK_URL
)

if (hasGoogleConfig) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const author = await oauthService.findOrCreateGoogleAuthor(profile)
                    done(null, author)
                } catch (error) {
                    done(error)
                }
            }
        )
    )
}

const requireGoogleConfig = (req, res, next) => {
    if (!hasGoogleConfig) {
        return res.status(500).json({
            statusCode: 500,
            message: "Configurazione Google OAuth mancante"
        })
    }

    next()
}

oauthRouter.get(
    "/google",
    requireGoogleConfig,
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
        session: false
    })
)

oauthRouter.get(
    "/google/callback",
    requireGoogleConfig,
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login`
    }),
    oauthController.googleCallback
)

module.exports = oauthRouter
