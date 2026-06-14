const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },
        cognome: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        dataDiNascita: {
            type: Date
        },
        avatar: String
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Author", authorSchema)
