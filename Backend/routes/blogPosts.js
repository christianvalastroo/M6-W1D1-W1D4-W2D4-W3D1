const express = require("express")
const BlogPost = require("../models/BlogPost")
const cloudinaryUploader = require("../middlewares/cloudinaryUploader")

const blogPostsRouter = express.Router()

// GET tutti i blog post con paginazione
blogPostsRouter.get("/", async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 10

        // Include i dati dell'autore per il template React.
        const blogPosts = await BlogPost.find()
            .populate("autore")
            .limit(limit)
            .skip((page - 1) * limit)

        const totalBlogPosts = await BlogPost.countDocuments()

        res.status(200).json({
            statusCode: 200,
            message: "OK",
            count: totalBlogPosts,
            totalPages: Math.ceil(totalBlogPosts / limit),
            currentPage: Number(page),
            data: blogPosts
        })

    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
})

// POST crea blog post
blogPostsRouter.post("/", async (req, res) => {
    try {
        const newBlogPost = new BlogPost(req.body)

        const savedBlogPost = await newBlogPost.save()

        res.status(201).json({
            statusCode: 201,
            message: "Created",
            data: savedBlogPost
        })

    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: "Bad Request"
        })
    }
})

// GET blog post singolo
blogPostsRouter.get("/:id", async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id).populate("autore")

        if (!blogPost) {
            return res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "OK",
            data: blogPost
        })

    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
})

// UPDATE blog post
blogPostsRouter.put("/:id", async (req, res) => {
    try {
        const updatedBlogPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        ).populate("autore")

        if (!updatedBlogPost) {
            return res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "Blog post updated",
            data: updatedBlogPost
        })

    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
})

// DELETE blog post
blogPostsRouter.delete("/:id", async (req, res) => {
    try {
        const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id)

        if (!deletedBlogPost) {
            return res.status(404).json({
                statusCode: 404,
                message: "Not Found"
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "Blog post deleted"
        })

    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
})

// PATCH upload cover blog post
blogPostsRouter.patch(
    "/:blogPostId/cover",
    cloudinaryUploader.single("cover"),
    async (req, res) => {
        try {
            const updatedBlogPost = await BlogPost.findByIdAndUpdate(
                req.params.blogPostId,
                {
                    cover: req.file.path
                },
                {
                    new: true
                }
            )

            if (!updatedBlogPost) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Blog post not found"
                })
            }

            res.status(200).json({
                statusCode: 200,
                message: "Cover uploaded",
                data: updatedBlogPost
            })

        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: error.message
            })
        }
    }
)

module.exports = blogPostsRouter
