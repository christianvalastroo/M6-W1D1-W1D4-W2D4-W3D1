const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true
        },
        cognome: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^\S+@\S+\.\S+$/
        },
        password: {
            type: String,
            required: true,
            select: false,
            minlength: 8
        },
        dataDiNascita: {
            type: Date
        },
        avatar: String,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Author", authorSchema)
