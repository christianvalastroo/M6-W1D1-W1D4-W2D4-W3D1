const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const blogPostSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        cover: {
            type: String
        },
        readTime: {
            value: Number,
            unit: String
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        comments: [commentSchema]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("BlogPost", blogPostSchema)