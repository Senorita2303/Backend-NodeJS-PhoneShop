const controller = require("~/controllers");
const router = require('express').Router();

const { auth } = require("~/middlewares/auth");
router.post("/add", auth, controller.addProductToCart);
router.patch("/update", auth, controller.updateItemQuantity);
router.delete("/:cartId", auth, controller.deleteItem);

module.exports = router;