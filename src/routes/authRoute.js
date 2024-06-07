const controller = require("~/controllers");
const passport = require("passport");
const uploadMiddleware = require("~/config/storageConfig");
const upload = uploadMiddleware("User");
const router = require('express').Router();
import { env } from '~/config/environment';

router.post("/register", upload.single("image"), controller.register);
router.post("/send-otp", controller.sendOTP);
router.post("/verify", controller.verifyOTP);
router.post("/login", controller.login);
router.get("/logout", controller.logout);
router.post("/login-success", controller.loginSuccess);
router.put("/password/reset/:token", controller.resetPassword);
router.post("/forgot-password", controller.forgotPassword);
//google
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
        req.user = profile
        next()
    })(req, res, next)
}, (req, res) => {
    res.redirect(`${env.FRONTEND_URL}/auth/jwt/login-success/${req.user?.id}/${req.user.tokenLogin}`)
}
);

module.exports = router;

// facebook
router.get('/facebook',
    passport.authenticate('facebook', {
        scope: ["email"],
        session: false
    })
);

router.get('/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, profile) => {
        req.user = profile
        next()
    })(req, res, next)
}, (req, res) => {
    res.redirect(`${env.FRONTEND_URL}/auth/jwt/login-success/${req.user?.id}/${req.user.tokenLogin}`)
}
);
