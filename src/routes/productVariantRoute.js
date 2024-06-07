const controller = require("~/controllers");
const uploadMiddleware = require("~/config/storageConfig");
const upload = uploadMiddleware("ProductVariant");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.get("/productVariant", controller.getAllProductVariants);
router.post("/admin/productVariant/new", auth, authPermission, upload.array("image", 7), controller.createProductVariant);
router.get("/admin/productVariants", auth, authPermission, controller.getAllProductVariantsAdmin);
router.put("/admin/productVariant/:id", auth, authPermission, upload.array("image", 7), controller.updateProductVariant);
router.delete("/admin/productVariant/:id", auth, authPermission, controller.deleteProductVariant);
router.get("/productVariant/:id", controller.getProductVariantDetails);

module.exports = router  