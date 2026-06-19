const express = require("express")
const authController = require("./auth.controller")
const verifyToken = require("../../middlewares/auth/verifyToken")

const authRouter = express.Router()

authRouter.post("/login", authController.login)
authRouter.get("/me", verifyToken, authController.me)

module.exports = authRouter
