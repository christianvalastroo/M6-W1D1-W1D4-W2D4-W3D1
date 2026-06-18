const BlogPost = require("./posts.schema")

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const getAllPosts = async (page, limit, title, authorId) => {
    const currentPage = Math.max(Number(page) || 1, 1)
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100)
    const filters = {}

    if (typeof title === "string" && title.trim()) {
        filters.title = {
            $regex: escapeRegex(title.trim()),
            $options: "i"
        }
    }

    if (authorId) {
        filters.author = authorId
    }

    const [posts, totalPosts] = await Promise.all([
        BlogPost.find(filters)
            .limit(pageSize)
            .skip((currentPage - 1) * pageSize)
            .populate("author"),
        BlogPost.countDocuments(filters)
    ])

    return {
        posts,
        totalPosts,
        totalPages: Math.ceil(totalPosts / pageSize),
        currentPage,
        pageSize
    }
}

const createPost = (postData) => BlogPost.create(postData)

const getPostById = (postId) => (
    BlogPost.findById(postId).populate("author")
)

const updatePost = (postId, authorId, postData) => (
    BlogPost.findOneAndUpdate(
        { _id: postId, author: authorId },
        {
            ...postData,
            author: authorId
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("author")
)

const deletePost = (postId, authorId) => (
    BlogPost.findOneAndDelete({ _id: postId, author: authorId })
)

const updatePostCover = (postId, authorId, cover) => (
    BlogPost.findOneAndUpdate(
        { _id: postId, author: authorId },
        { cover },
        { new: true }
    )
)

module.exports = {
    getAllPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost,
    updatePostCover
}
