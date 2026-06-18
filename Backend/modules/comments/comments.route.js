const express = require("express")
const commentsController = require("./comments.controller")
const verifyToken = require("../../middlewares/auth/verifyToken")
const {
    cacheMiddleware,
    invalidateCacheMiddleware
} = require("../../middlewares/globals/cacheMiddleware")

const commentsRouter = express.Router({ mergeParams: true })

commentsRouter.get("/", cacheMiddleware, commentsController.getComments)
commentsRouter.post(
    "/",
    verifyToken,
    invalidateCacheMiddleware,
    commentsController.createComment
)
commentsRouter.put(
    "/comment/:commentId",
    verifyToken,
    invalidateCacheMiddleware,
    commentsController.updateComment
)
commentsRouter.delete(
    "/comment/:commentId",
    verifyToken,
    invalidateCacheMiddleware,
    commentsController.deleteComment
)
commentsRouter.get(
    "/:commentId",
    cacheMiddleware,
    commentsController.getComment
)
commentsRouter.put(
    "/:commentId",
    verifyToken,
    invalidateCacheMiddleware,
    commentsController.updateComment
)
commentsRouter.delete(
    "/:commentId",
    verifyToken,
    invalidateCacheMiddleware,
    commentsController.deleteComment
)

module.exports = commentsRouter
