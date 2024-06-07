const router = require('express').Router();

const { createComment, getComments, updateComment, deleteComment } = require("~/controllers/commentController");
const { isAuthenticatedUser } = require("~/middlewares/auth");
router.post("/new/comment", createComment);
router.get("/comments", getComments);
router.get("/comment/:product", getComments);
router.patch("/comment/:id", isAuthenticatedUser, updateComment);
router.delete("/comment/:id", isAuthenticatedUser, deleteComment);

module.exports = router;