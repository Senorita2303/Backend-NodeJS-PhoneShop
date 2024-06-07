const controller = require("~/controllers");
const uploadMiddleware = require("~/config/storageConfig");
const upload = uploadMiddleware("Brand");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.get("/brand", controller.getAllBrands);
router.post("/admin/brand/new", auth, authPermission, upload.single("image"), controller.createBrand);
router.get("/admin/brands", auth, authPermission, controller.getAllBrands);
router.put("/admin/brand/:id", auth, authPermission, upload.single("image"), controller.updateBrand);
router.delete("/admin/brand/:id", auth, authPermission, controller.deleteBrand);
router.get("/brand/:id", auth, authPermission, controller.getBrandDetails);

module.exports = router  