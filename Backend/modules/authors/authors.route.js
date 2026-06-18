const express = require("express")
const cloudinaryUploader = require("../../middlewares/multer")
const verifyToken = require("../../middlewares/auth/verifyToken")
const isAdminMiddleware = require("../../middlewares/globals/isAdminMiddleware")
const {
    cacheMiddleware,
    invalidateCacheMiddleware
} = require("../../middlewares/globals/cacheMiddleware")
const {
    registerAuthorValidation,
    updateAuthorValidation,
    updateRoleValidation,
    validateAuthorBody
} = require("../../middlewares/authors/validateAuthorBodyMiddleware")
const postsController = require("../posts/posts.controller")
const authorsController = require("./authors.controller")

const authorsRouter = express.Router()

authorsRouter.get("/", cacheMiddleware, authorsController.getAuthors)
authorsRouter.post(
    "/",
    registerAuthorValidation,
    validateAuthorBody,
    invalidateCacheMiddleware,
    authorsController.createAuthor
)
authorsRouter.get(
    "/:id/blogPosts",
    cacheMiddleware,
    postsController.getPostsByAuthor
)
authorsRouter.get("/:id", cacheMiddleware, authorsController.getAuthor)
authorsRouter.put(
    "/:id",
    verifyToken,
    updateAuthorValidation,
    validateAuthorBody,
    invalidateCacheMiddleware,
    authorsController.updateAuthor
)
authorsRouter.patch(
    "/:id/role",
    verifyToken,
    isAdminMiddleware,
    updateRoleValidation,
    validateAuthorBody,
    invalidateCacheMiddleware,
    authorsController.updateAuthorRole
)
authorsRouter.delete(
    "/:id",
    verifyToken,
    invalidateCacheMiddleware,
    authorsController.deleteAuthor
)
authorsRouter.patch(
    "/:authorId/avatar",
    verifyToken,
    cloudinaryUploader.single("avatar"),
    invalidateCacheMiddleware,
    authorsController.uploadAvatar
)

module.exports = authorsRouter
