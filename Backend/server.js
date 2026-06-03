const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authorsRouter = require("./routes/authors")
const blogPostsRouter = require("./routes/blogPosts")

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.use("/authors", authorsRouter)
app.use("/blogPosts", blogPostsRouter)

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
    console.log("MongoDB collegato 🚀")
})

mongoose.connection.on("error", (error) => {
    console.log("Errore MongoDB:", error)
})

app.get("/", (req, res) => {
    res.send("Blog di Server Strive online 🚀")
})

app.listen(PORT, () => {
    console.log("Server attivo sulla porta " + PORT)
})