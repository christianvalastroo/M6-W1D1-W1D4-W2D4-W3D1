require("dotenv").config()

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const errorHandler = require("./middlewares/errors/errorHandler")

const authRouter = require("./modules/auth/auth.route")
const authorsRouter = require("./modules/authors/authors.route")
const postsRouter = require("./modules/posts/posts.route")
const commentsRouter = require("./modules/comments/comments.route")

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cors())

app.use("/auth", authRouter)
app.use("/authors", authorsRouter)
app.use("/blogPosts/:id/comments", commentsRouter)
app.use("/blogPosts", postsRouter)

app.get("/", (req, res) => {
    res.send("Blog di Server Strive online")
})

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