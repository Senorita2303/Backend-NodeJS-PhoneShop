const controller = require("~/controllers");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.post("/create", auth, controller.createOrder);
router.get("/:id", auth, controller.getSingleOrder);
router.get("/admin/order/:id", auth, authPermission, controller.getAdminSingleOrder);
router.get("/", auth, controller.myOrders);
router.get("/admin/orders", auth, authPermission, controller.getAllOrders);
router.put("/admin/order/:id", auth, authPermission, controller.updateOrder);
router.delete("/admin/order/:id", auth, authPermission, controller.deleteOrder);

module.exports = router;
