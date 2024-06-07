const controller = require("~/controllers");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.post("/admin/specification/new", auth, authPermission, controller.createSpecification);
router.get("/admin/specifications", auth, authPermission, controller.getAllSpecifications);
router.put("/admin/brand/:id", auth, authPermission, controller.updateSpecification);
router.delete("/admin/brand/:id", auth, authPermission, controller.deleteSpecification);

module.exports = router  