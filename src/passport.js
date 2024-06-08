const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require("~/models");
const passport = require("passport");
const { v4: uuidv4 } = require('uuid');
const { comparePassword, jwtCreate, jwtVerify, hashPassword } = require('~/utils');
import { env } from '~/config/environment';
// GITHUB_CLIENT_ID = "your id";
// GITHUB_CLIENT_SECRET = "your id";

// FACEBOOK_APP_ID = "your id";
// FACEBOOK_APP_SECRET = "your id";

passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${env.BACKEND_URL}/api/auth/google/callback`,
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            if (profile?.id) {
                let hashPasswordFromBcrypt = await hashPassword("123456");
                let response = await db.User.findOrCreate({
                    where: {
                        email: profile.emails[0]?.value,
                    },
                    defaults: {
                        email: profile.emails[0]?.value,
                        userName: profile?.displayName,
                        avatarUrl: profile?.photos[0]?.value,
                        password: hashPasswordFromBcrypt
                    },
                })
                const user = await db.User.findOne({
                    where: {
                        email: profile.emails[0]?.value,
                    },
                    raw: false,
                })
                const { refreshToken } = jwtCreate(user.id);
                user.refreshToken = refreshToken;
                if (response[1]) {
                    user.isVerified = true;
                }
                await user.save();
                profile.tokenLogin = refreshToken;
                profile.id = user.id;
            }
        } catch (error) {
            console.log(error)
        }
        // console.log(profile);
        return cb(null, profile);
        // done(null, profile);
    }
)
);

// passport.use(
//     new GithubStrategy(
//         {
//             clientID: GITHUB_CLIENT_ID,
//             clientSecret: GITHUB_CLIENT_SECRET,
//             callbackURL: "/auth/github/callback",
//         },
//         function (accessToken, refreshToken, profile, done) {
//             done(null, profile);
//         }
//     )
// );

passport.use(new FacebookStrategy({
    clientID: env.FACEBOOK_APP_ID,
    clientSecret: env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/auth/facebook/callback",
    profileFields: ['email', 'photos', 'id', 'displayName']
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            if (profile?.id) {
                let response = await db.User.findOrCreate({
                    where: {
                        email: profile.emails[0]?.value,
                    },
                    defaults: {
                        email: profile.emails[0]?.value,
                        userName: profile?.displayName,
                        avatarUrl: profile?.photos[0]?.value,
                    },
                })
                const user = await db.User.findOne({
                    where: {
                        email: profile.emails[0]?.value,
                    },
                })
                const { refreshToken } = jwtCreate(user.id);
                profile.tokenLogin = refreshToken;
                await db.User.update({
                    refreshToken: refreshToken
                }, {
                    where: { email: profile.emails[0]?.value }
                })
            }
        } catch (error) {
            console.log(error)
        }
        // console.log(profile);
        return cb(null, profile);
    }
)
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});