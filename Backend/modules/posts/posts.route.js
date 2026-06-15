const express = require("express")
const cloudinaryUploader = require("../../middlewares/multer")
const verifyToken = require("../../middlewares/auth/verifyToken")
const {
    cacheMiddleware,
    invalidateCacheMiddleware
} = require("../../middlewares/globals/cacheMiddleware")
const postsController = require("./posts.controller")

const postsRouter = express.Router()

postsRouter.get("/", cacheMiddleware, postsController.getPosts)
postsRouter.post(
    "/",
    verifyToken,
    invalidateCacheMiddleware,
    postsController.createPost
)
postsRouter.get("/:id", cacheMiddleware, postsController.getPost)
postsRouter.put(
    "/:id",
    verifyToken,
    invalidateCacheMiddleware,
    postsController.updatePost
)
postsRouter.delete(
    "/:id",
    verifyToken,
    invalidateCacheMiddleware,
    postsController.deletePost
)
postsRouter.patch(
    "/:blogPostId/cover",
    verifyToken,
    cloudinaryUploader.single("cover"),
    invalidateCacheMiddleware,
    postsController.uploadCover
)

module.exports = postsRouter
