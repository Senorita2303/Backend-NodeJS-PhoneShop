const controller = require("~/controllers");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.post("/admin/memory/new", auth, authPermission, controller.createMemory);
router.get("/admin/memories", auth, authPermission, controller.getAllMemories);
router.put("/admin/brand/:id", auth, authPermission, controller.updateMemory);
router.delete("/admin/brand/:id", auth, authPermission, controller.deleteMemory);

module.exports = router  