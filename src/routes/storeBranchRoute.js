const controller = require("~/controllers");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.post("/admin/new", auth, authPermission, controller.createStoreBranch);
router.get("/admin/storeBranches", controller.getAllStoreBranches);
router.put("/admin/:id", auth, authPermission, controller.updateStoreBranch);
router.delete("/admin/:id", auth, authPermission, controller.deleteStoreBranch);

module.exports = router  