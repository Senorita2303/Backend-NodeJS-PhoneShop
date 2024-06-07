const controller = require("~/controllers");
const uploadMiddleware = require("~/config/storageConfig");
const upload = uploadMiddleware("User");
const router = require('express').Router();

const { auth, authPermission } = require("~/middlewares/auth");

router.put("/password/update", auth, controller.updatePassword);
router.get("/profile", auth, controller.getUserDetails);
router.put("/profile/update", auth, upload.single("image"), controller.updateProfile);
router.get("/admin/users", auth, authPermission, controller.getAllUser);
router.get("/admin/user/:id", auth, authPermission, controller.getSingleUser);
router.put("/admin/user/:id", auth, authPermission, controller.updateUserRole);
router.delete("/admin/user/:id", auth, authPermission, controller.deleteUser);


module.exports = router;