const controller = require("~/controllers");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.post("/admin/color/new", auth, authPermission, controller.createColor);
router.get("/admin/colors", auth, authPermission, controller.getAllColors);
router.put("/admin/brand/:id", auth, authPermission, controller.updateColor);
router.delete("/admin/brand/:id", auth, authPermission, controller.deleteColor);

module.exports = router  