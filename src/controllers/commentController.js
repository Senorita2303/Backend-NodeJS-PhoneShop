const CommentModel = require("~/models/commentModel");
const ErrorHandler = require("~/utils/errorHandler");
const asyncWrapper = require("~/middlewares/asyncWrapper");
const SELECT_FIELD = '_id author anonymousAuthor content disLikes isVerified likes product replies star createdAt updatedAt';
const POPULATE_OPTS = [
    {
        path: 'author',
        select: 'name avatar _id',
        model: 'UsersModel'
    },
];

function getCommentFromRequest(req) {
    let comment = { product: req.body.product };

    if (req.body.author) { comment.author = req.body.author; }
    else { comment.anonymousAuthor = {}; }
    if (req.body.name) { comment.anonymousAuthor.name = req.body.name; }
    if (req.body.email) { comment.anonymousAuthor.email = req.body.email; }
    if (req.body.phone) { comment.anonymousAuthor.phone = req.body.phone; }
    if (req.body.content) { comment.content = req.body.content; }
    if (req.body.star) { comment.star = req.body.star; }

    return comment;
}

export const getComments = asyncWrapper(async (req, res, next) => {
    const { product } = req.params;
    const comments = await CommentModel.find({ product: product })
        .select(SELECT_FIELD)
        .populate(POPULATE_OPTS)
        .sort({ createdAt: -1 }).lean().exec();
    if (comments && comments.length > 0) {
        res.status(200).json({
            comments: comments,
        });
    } else {
        return next(new ErrorHandler("No comments found!", 404));
    }
});

export const createComment = asyncWrapper(async (req, res, next) => {
    console.log(req.body);
    let comment = { product: req.body.product };

    if (req.body.author) { comment.author = req.body.author; }
    else { comment.anonymousAuthor = {}; }
    if (req.body.name) { comment.anonymousAuthor.name = req.body.name; }
    if (req.body.email) { comment.anonymousAuthor.email = req.body.email; }
    if (req.body.phone) { comment.anonymousAuthor.phone = req.body.phone; }
    if (req.body.content) { comment.content = req.body.content; }
    if (req.body.star) { comment.star = req.body.star; }
    const newComment = await CommentModel.create(comment);
    await newComment.save();
    res.status(201).json({
        message: "Create new comment successfully!",
        comment: newComment,
    });
});

export const updateComment = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updated = getCommentFromRequest(req);
    const updatedComment = await CommentModel.findByIdAndUpdate(id, updated, { new: true });
    if (updatedComment) {
        res.status(201).json({
            message: "Update comment successfully!",
            comment: updatedComment,
        });
    } else {
        return next(new ErrorHandler("Comment not found!", 404));
    }
});

export const verifiedComment = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const status = req.body.status || false;
    const updatedComment = await CommentModel.findByIdAndUpdate(id, { isVerified: status }, { new: true });
    if (updatedComment) {
        let message = status ? 'Verified comment successfully!' : 'Unverified comment successfully!';
        res.status(200).json({
            message: message,
            comment: updatedComment,
        });
    } else {
        return next(new ErrorHandler("Comment not found!", 404));
    }
});

export const deleteComment = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedComment = await CommentModel.findByIdAndRemove(id);
    if (deletedComment) {
        res.status(204).json({
            message: "Deleted comment successfully!",
            comment: deletedComment,
        });
    } else {
        return next(new ErrorHandler("Comment not found!", 404));
    }

});