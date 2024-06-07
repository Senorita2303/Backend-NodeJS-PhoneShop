const controller = require("~/controllers");
const uploadMiddleware = require("~/config/storageConfig");
const upload = uploadMiddleware("Category");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.get("/category", controller.getAllCategories);
router.post("/admin/category/new", auth, authPermission, upload.single("image"), controller.createCategory);
router.get("/admin/categories", auth, authPermission, controller.getAllCategories);
router.put("/admin/category/:id", auth, authPermission, upload.single("image"), controller.updateCategory);
router.delete("/admin/category/:id", auth, authPermission, controller.deleteCategory);
router.get("/category/:id", controller.getCategoryDetails);

module.exports = router  