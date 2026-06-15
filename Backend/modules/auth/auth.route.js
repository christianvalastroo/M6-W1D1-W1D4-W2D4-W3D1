const express = require("express")
const authController = require("./auth.controller")
const verifyToken = require("../../middlewares/auth/verifyToken")
const {
    invalidateCacheMiddleware
} = require("../../middlewares/globals/cacheMiddleware")
const {
    registerAuthorValidation,
    validateAuthorBody
} = require("../../middlewares/authors/validateAuthorBodyMiddleware")

const authRouter = express.Router()

authRouter.post(
    "/register",
    registerAuthorValidation,
    validateAuthorBody,
    invalidateCacheMiddleware,
    authController.register
)
authRouter.post("/login", authController.login)
authRouter.get("/me", verifyToken, authController.me)

module.exports = authRouter
