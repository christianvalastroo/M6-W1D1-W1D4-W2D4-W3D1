const express = require("express")
const commentsController = require("./comments.controller")
const { cacheMiddleware } = require("../../middlewares/globals/cacheMiddleware")

const commentsRouter = express.Router({ mergeParams: true })

commentsRouter.get("/", cacheMiddleware, commentsController.getComments)
commentsRouter.get(
    "/:commentId",
    cacheMiddleware,
    commentsController.getComment
)

module.exports = commentsRouter
