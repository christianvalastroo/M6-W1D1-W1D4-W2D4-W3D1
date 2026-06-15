const BlogPost = require("../posts/posts.schema")

const createComment = (postId, commentData) => (
    BlogPost.findByIdAndUpdate(
        postId,
        { $push: { comments: commentData } },
        { new: true, runValidators: true }
    )
)

const getPostWithComments = (postId) => BlogPost.findById(postId)

const updateComment = (postId, commentId, authorId, commentData) => (
    BlogPost.findOneAndUpdate(
        {
            _id: postId,
            comments: {
                $elemMatch: {
                    _id: commentId,
                    author: authorId
                }
            }
        },
        {
            $set: {
                "comments.$.comment": commentData.comment,
                "comments.$.rate": commentData.rate
            }
        },
        {
            new: true,
            runValidators: true
        }
    )
)

const deleteComment = (postId, commentId, authorId) => (
    BlogPost.findOneAndUpdate(
        {
            _id: postId,
            comments: {
                $elemMatch: {
                    _id: commentId,
                    author: authorId
                }
            }
        },
        {
            $pull: {
                comments: {
                    _id: commentId,
                    author: authorId
                }
            }
        },
        { new: true }
    )
)

module.exports = {
    createComment,
    getPostWithComments,
    updateComment,
    deleteComment
}
