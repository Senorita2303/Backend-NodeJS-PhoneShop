const controller = require("~/controllers");
const router = require('express').Router();
const { auth } = require("~/middlewares/auth");

router.post("/new", auth, controller.createReview);
router.get("/reviews/:id", controller.getAllReviews);

module.exports = router  