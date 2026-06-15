const Author = require("./authors.schema")
const { hashPassword } = require("../auth/password/password.service")
const AppError = require("../../exceptions/AppError")

const getAllAuthors = async (page, limit) => {
    const currentPage = Math.max(Number(page) || 1, 1)
    const pageSize = Math.max(Number(limit) || 10, 1)

    const [authors, totalAuthors] = await Promise.all([
        Author.find()
            .limit(pageSize)
            .skip((currentPage - 1) * pageSize),
        Author.countDocuments()
    ])

    return {
        authors,
        totalAuthors,
        totalPages: Math.ceil(totalAuthors / pageSize),
        currentPage
    }
}

const getAuthorById = (authorId) => Author.findById(authorId)

const updateAuthor = async (authorId, authorData) => {
    const updateData = { ...authorData }

    if (Object.hasOwn(updateData, "password")) {
        if (
            typeof updateData.password !== "string"
            || updateData.password.length < 8
        ) {
            throw new AppError(
                400,
                "La password deve contenere almeno 8 caratteri"
            )
        }

        updateData.password = await hashPassword(updateData.password)
    }

    if (typeof updateData.email === "string") {
        updateData.email = updateData.email.trim().toLowerCase()
    }

    return Author.findByIdAndUpdate(authorId, updateData, {
        new: true,
        runValidators: true
    })
}

const deleteAuthor = (authorId) => Author.findByIdAndDelete(authorId)

const updateAuthorAvatar = (authorId, avatar) => (
    Author.findByIdAndUpdate(authorId, { avatar }, { new: true })
)

const updateAuthorRole = (authorId, role) => (
    Author.findByIdAndUpdate(
        authorId,
        { role },
        {
            new: true,
            runValidators: true
        }
    )
)

module.exports = {
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
    updateAuthorAvatar,
    updateAuthorRole
}
