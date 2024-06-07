const controller = require("~/controllers");
const router = require('express').Router();
const { auth } = require("~/middlewares/auth");

router.get('/', controller.createPayment);
router.post('/create', auth, controller.createPayment);
router.get('/vnpay_return', controller.returnPayment);