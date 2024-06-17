const controller = require("~/controllers");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");

router.get('/sales-report', auth, authPermission, controller.getSalesReport)

module.exports = router;