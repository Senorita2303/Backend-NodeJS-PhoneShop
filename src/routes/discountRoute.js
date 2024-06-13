const controller = require("~/controllers");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.post("/admin/new", auth, authPermission, controller.createDiscount);
router.get("/admin/discounts", controller.getAllDiscounts);
router.put("/admin/:id", auth, authPermission, controller.updateDiscount);
router.delete("/admin/:id", auth, authPermission, controller.deleteDiscount);
router.get("/:id", controller.getDiscountDetails);

module.exports = router  