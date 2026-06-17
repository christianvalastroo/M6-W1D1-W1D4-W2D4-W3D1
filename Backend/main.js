require("dotenv").config()

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const errorHandler = require("./middlewares/errors/errorHandler")

const logger = require("./middlewares/globals/logger")
const responseTimerMiddleware = require("./middlewares/globals/responseTimerMiddleware")

const authRouter = require("./modules/auth/auth.route")
const authorsRouter = require("./modules/authors/authors.route")
const postsRouter = require("./modules/posts/posts.route")
const commentsRouter = require("./modules/comments/comments.route")
const passport = require("passport")
const oauthRouter = require("./modules/oauth/oauth.route")

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(passport.initialize())

// Registra ogni richiesta e misura il tempo impiegato per completarla.
app.use(logger)
app.use(responseTimerMiddleware)

// Collega i router ai rispettivi percorsi principali.
app.use("/auth", authRouter)
app.use("/auth", oauthRouter)
app.use("/authors", authorsRouter)
app.use("/blogPosts/:id/comments", commentsRouter)
app.use("/blogPosts", postsRouter)

app.get("/", (req, res) => {
    res.send("Blog di Server Strive online")
})

// Deve essere registrato dopo le route per intercettare gli errori.
app.use(errorHandler)

const startServer = async () => {
    try {
        await connectDB()

        app.listen(PORT, () => {
            console.log(`Server attivo sulla porta ${PORT}`)
        })
    } catch (error) {
        console.error("Impossibile avviare il server:", error.message)
        process.exit(1)
    }
}

if (require.main === module) {
    startServer()
}

module.exports = { app, startServer }
