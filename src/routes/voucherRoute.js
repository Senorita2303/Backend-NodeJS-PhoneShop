const controller = require("~/controllers");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.post("/admin/new", auth, authPermission, controller.createVoucher);
router.get("/admin/vouchers", controller.getAllVouchers);
router.put("/admin/:id", auth, authPermission, controller.updateVoucher);
router.delete("/admin/:id", auth, authPermission, controller.deleteVoucher);
router.get("/:id", controller.getVoucherDetails);

module.exports = router  