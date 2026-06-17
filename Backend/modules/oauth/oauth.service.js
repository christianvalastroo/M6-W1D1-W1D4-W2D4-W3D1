const Author = require("../authors/authors.schema")
const AppError = require("../../exceptions/AppError")

const getEmailFromProfile = (profile) => {
    const email = profile.emails?.[0]?.value

    if (!email) {
        throw new AppError(400, "L'account Google non ha un'email disponibile")
    }

    return email.trim().toLowerCase()
}

const findOrCreateGoogleAuthor = async (profile) => {
    const email = getEmailFromProfile(profile)

    let author = await Author.findOne({ email })

    if (author) {
        if (!author.googleId) {
            author.googleId = profile.id
        }

        author.provider = author.provider || "google"

        if (!author.avatar && profile.photos?.[0]?.value) {
            author.avatar = profile.photos[0].value
        }

        return author.save()
    }

    return Author.create({
        nome: profile.name?.givenName || profile.displayName || "Google",
        cognome: profile.name?.familyName || "User",
        email,
        googleId: profile.id,
        provider: "google",
        avatar: profile.photos?.[0]?.value
    })
}

module.exports = {
    findOrCreateGoogleAuthor
}
