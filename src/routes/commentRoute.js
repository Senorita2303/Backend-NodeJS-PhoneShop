const controller = require("~/controllers");
const router = require('express').Router();
const { auth } = require("~/middlewares/auth");

router.post("/new", auth, controller.createComment);
router.get("/comments/:id", controller.getAllComments);
router.patch("/:id", auth, controller.updateComment);
router.delete("/:id", auth, controller.deleteComment);

module.exports = router;