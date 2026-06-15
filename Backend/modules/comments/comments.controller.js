const AppError = require("../../exceptions/AppError")
const commentsService = require("./comments.service")

const createComment = async (req, res) => {
    const post = await commentsService.createComment(req.params.id, {
        ...req.body,
        name: `${req.author.nome} ${req.author.cognome}`.trim(),
        author: req.author._id
    })

    if (!post) {
        throw new AppError(404, "Blog post not found")
    }

    res.status(201).json({
        statusCode: 201,
        message: "Comment created",
        data: post.comments
    })
}

const getComments = async (req, res) => {
    const post = await commentsService.getPostWithComments(req.params.id)

    if (!post) {
        throw new AppError(404, "Blog post not found")
    }

    res.status(200).json({
        statusCode: 200,
        message: "OK",
        data: post.comments
    })
}

const getComment = async (req, res) => {
    const post = await commentsService.getPostWithComments(req.params.id)

    if (!post) {
        throw new AppError(404, "Blog post not found")
    }

    const comment = post.comments.id(req.params.commentId)

    if (!comment) {
        throw new AppError(404, "Comment not found")
    }

    res.status(200).json({
        statusCode: 200,
        message: "OK",
        data: comment
    })
}

const updateComment = async (req, res) => {
    const post = await commentsService.updateComment(
        req.params.id,
        req.params.commentId,
        req.author._id,
        req.body
    )

    if (!post) {
        throw new AppError(404, "Blog post or comment not found")
    }

    res.status(200).json({
        statusCode: 200,
        message: "Comment updated",
        data: post.comments.id(req.params.commentId)
    })
}

const deleteComment = async (req, res) => {
    const post = await commentsService.deleteComment(
        req.params.id,
        req.params.commentId,
        req.author._id
    )

    if (!post) {
        throw new AppError(404, "Blog post or comment not found")
    }

    res.status(200).json({
        statusCode: 200,
        message: "Comment deleted"
    })
}

module.exports = {
    createComment,
    getComments,
    getComment,
    updateComment,
    deleteComment
}
