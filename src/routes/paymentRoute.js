const controller = require("~/controllers");
const router = require('express').Router();
const { auth, authPermission } = require("~/middlewares/auth");
router.get("/vnpay/callback", controller.getVnpayResult);
router.post("/zalopay/callback", controller.getZalopayResult);
// router.get("/stripeapikey", sendStripeApiKey);

module.exports = router