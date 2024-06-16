const controller = require("~/controllers");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.get("/", auth, controller.fetchAllInventories);
router.get("/:id", auth, authPermission, controller.getInventoryById);
router.get("/find/:idInventory", auth, controller.findInventory);
router.patch("/:id", auth, controller.updateStock);
router.get("/admin/history", auth, controller.findInventoryHistory)

module.exports = router;