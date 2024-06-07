const controller = require("~/controllers");
const uploadMiddleware = require("~/config/storageConfig");
const upload = uploadMiddleware("Product");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.get("/product", controller.getAllProducts);
router.post("/admin/product/new", auth, authPermission, upload.single("image"), controller.createProduct);
router.get("/admin/products", auth, authPermission, controller.getAllProductsAdmin);
router.put("/admin/product/:id", auth, authPermission, upload.single("image"), controller.updateProduct);
router.delete("/admin/product/:id", auth, authPermission, controller.deleteProduct);
router.get("/product/:id", controller.getProductDetails);

module.exports = router  