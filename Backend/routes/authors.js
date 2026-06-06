const express = require("express")
const Author = require("../models/Author")
const cloudinaryUploader = require("../middlewares/cloudinaryUploader")

const authorsRouter = express.Router()

// GET tutti gli autori
authorsRouter.get("/", async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 10

        const authors = await Author.find()
            .limit(limit)
            .skip((page - 1) * limit)

        const totalAuthors = await Author.countDocuments()

        res.status(200).json({
            statusCode: 200,
            message: "OK",
            count: totalAuthors,
            totalPages: Math.ceil(totalAuthors / limit),
            currentPage: Number(page),
            data: authors
        })

    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
})

// POST crea autore
authorsRouter.post("/", async (req, res) => {
    try {
        const newAuthor = new Author(req.body)

        const savedAuthor = await newAuthor.save()

        res.status(201).json({
            statusCode: 201,
            message: "Created",
            data: savedAuthor
        })

    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: "Bad Request"
        })
    }
})

// GET autore singolo
authorsRouter.get("/:id", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)

        if (!author) {
            return res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "OK",
            data: author
        })

    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
})

// UPDATE autore
authorsRouter.put("/:id", async (req, res) => {
    try {
        const updatedAuthor = await Author.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        )

        if (!updatedAuthor) {
            return res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "Author updated",
            data: updatedAuthor
        })

    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
})

// DELETE autore
authorsRouter.delete("/:id", async (req, res) => {
    try {
        const deletedAuthor = await Author.findByIdAndDelete(req.params.id)

        if (!deletedAuthor) {
            return res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "Author deleted"
        })

    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
})

// PATCH upload avatar autore
authorsRouter.patch(
    "/:authorId/avatar",
    cloudinaryUploader.single("avatar"),
    async (req, res) => {
        try {
            const updatedAuthor = await Author.findByIdAndUpdate(
                req.params.authorId,
                {
                    avatar: req.file.path
                },
                {
                    new: true
                }
            )

            if (!updatedAuthor) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Author not found"
                })
            }

            res.status(200).json({
                statusCode: 200,
                message: "Avatar uploaded",
                data: updatedAuthor
            })

        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: error.message
            })
        }
    }
)

module.exports = authorsRouter