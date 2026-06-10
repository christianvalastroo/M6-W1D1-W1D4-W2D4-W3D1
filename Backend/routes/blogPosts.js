const express = require("express")
const BlogPost = require("../models/BlogPost")
const cloudinaryUploader = require("../middlewares/cloudinaryUploader")

const blogPostsRouter = express.Router()

// GET tutti i blog post
blogPostsRouter.get("/", async (req, res) => {
    try {
        const blogPosts = await BlogPost.find().populate("autore")

        res.status(200).json({
            statusCode: 200,
            message: "OK",
            data: blogPosts
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
})

// POST crea commento
blogPostsRouter.post("/:id/comments", async (req, res) => {
    try {
        const updatedBlogPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: req.body
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedBlogPost) {
            return res.status(404).json({
                statusCode: 404,
                message: "Blog post not found"
            })
        }

        res.status(201).json({
            statusCode: 201,
            message: "Comment created",
            data: updatedBlogPost.comments
        })
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: error.message
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
            message: error.message
        })
    }
})

// GET tutti i commenti di un blog post
blogPostsRouter.get("/:id/comments", async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id)

        if (!blogPost) {
            return res.status(404).json({
                statusCode: 404,
                message: "Blog post not found"
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "OK",
            data: blogPost.comments
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
})

// GET commento singolo
blogPostsRouter.get("/:id/comments/:commentId", async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id)

        if (!blogPost) {
            return res.status(404).json({
                statusCode: 404,
                message: "Blog post not found"
            })
        }

        const comment = blogPost.comments.id(req.params.commentId)

        if (!comment) {
            return res.status(404).json({
                statusCode: 404,
                message: "Comment not found"
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "OK",
            data: comment
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
})

// PUT modifica commento
blogPostsRouter.put("/:id/comments/:commentId", async (req, res) => {
    try {
        const updatedBlogPost = await BlogPost.findOneAndUpdate(
            {
                _id: req.params.id,
                "comments._id": req.params.commentId
            },
            {
                $set: {
                    "comments.$.name": req.body.name,
                    "comments.$.comment": req.body.comment
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedBlogPost) {
            return res.status(404).json({
                statusCode: 404,
                message: "Blog post or comment not found"
            })
        }

        const updatedComment = updatedBlogPost.comments.id(req.params.commentId)

        res.status(200).json({
            statusCode: 200,
            message: "Comment updated",
            data: updatedComment
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: error.message
        })
    }
})

// DELETE elimina commento
blogPostsRouter.delete("/:id/comments/:commentId", async (req, res) => {
    try {
        const updatedBlogPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.params.commentId
                    }
                }
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
            message: "Comment deleted"
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: error.message
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
            message: error.message
        })
    }
})

// PUT modifica blog post
blogPostsRouter.put("/:id", async (req, res) => {
    try {
        const updatedBlogPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
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
            message: error.message
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
            message: error.message
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
                { cover: req.file.path },
                { new: true }
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