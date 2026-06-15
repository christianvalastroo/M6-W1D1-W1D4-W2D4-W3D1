const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        rate: {
            type: Number,
            min: 1,
            max: 5,
            default: 1
        },
        comment: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author"
        }
    },
    {
        timestamps: true
    }
)

module.exports = commentSchema
