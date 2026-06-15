const AppError = require("../../exceptions/AppError")
const authorsService = require("./authors.service")

const getAuthors = async (req, res) => {
    const result = await authorsService.getAllAuthors(
        req.query.page,
        req.query.pageSize ?? req.query.limit
    )

    res.status(200).json({
        statusCode: 200,
        message: "OK",
        count: result.totalAuthors,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        data: result.authors
    })
}

const getAuthor = async (req, res) => {
    const author = await authorsService.getAuthorById(req.params.id)

    if (!author) {
        throw new AppError(404, "Author not found")
    }

    res.status(200).json({
        statusCode: 200,
        message: "OK",
        data: author
    })
}

const updateAuthor = async (req, res) => {
    if (req.author.id !== req.params.id) {
        throw new AppError(403, "Non puoi modificare un altro autore")
    }

    const author = await authorsService.updateAuthor(req.params.id, req.body)

    if (!author) {
        throw new AppError(404, "Author not found")
    }

    res.status(200).json({
        statusCode: 200,
        message: "Author updated",
        data: author
    })
}

const deleteAuthor = async (req, res) => {
    if (req.author.id !== req.params.id) {
        throw new AppError(403, "Non puoi eliminare un altro autore")
    }

    const author = await authorsService.deleteAuthor(req.params.id)

    if (!author) {
        throw new AppError(404, "Author not found")
    }

    res.status(200).json({
        statusCode: 200,
        message: "Author deleted"
    })
}

const uploadAvatar = async (req, res) => {
    if (req.author.id !== req.params.authorId) {
        throw new AppError(403, "Non puoi modificare un altro autore")
    }

    if (!req.file) {
        throw new AppError(400, "Avatar file is required")
    }

    const author = await authorsService.updateAuthorAvatar(
        req.params.authorId,
        req.file.path
    )

    if (!author) {
        throw new AppError(404, "Author not found")
    }

    res.status(200).json({
        statusCode: 200,
        message: "Avatar uploaded",
        data: author
    })
}

const updateAuthorRole = async (req, res) => {
    const author = await authorsService.updateAuthorRole(
        req.params.id,
        req.body.role
    )

    if (!author) {
        throw new AppError(404, "Author not found")
    }

    res.status(200).json({
        statusCode: 200,
        message: "Author role updated",
        data: author
    })
}

module.exports = {
    getAuthors,
    getAuthor,
    updateAuthor,
    deleteAuthor,
    uploadAvatar,
    updateAuthorRole
}
