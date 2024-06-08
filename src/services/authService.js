const { Op } = require('sequelize');
const db = require("~/models");
// bcrypt.js use hashing password
const bcrypt = require("bcryptjs");
const otpGenerator = require('otp-generator');
const sendEmail = require("~/utils/sendEmail");
import { env } from '~/config/environment';

const { comparePassword, jwtCreate, jwtVerify, hashPassword } = require('~/utils');

const hashOTP = (otp) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashOtp = await bcrypt.hashSync(otp, bcrypt.genSaltSync(12));
            resolve(hashOtp);
        } catch (e) {
            reject(e)
        }
    })
};

const correctOTP = (candidateOTP, userOTP) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await bcrypt.compareSync(candidateOTP, userOTP);
            resolve(check);
        } catch (e) {
            reject(e)
        }
    })
};

const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
};

export const register = (data, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    message: 'Your email in Used'
                });
            } else {
                let hashPasswordFromBcrypt = await hashPassword(data.password);
                const newUser = await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    userName: data.userName,
                    avatarUrl: fileData.path
                })
                resolve({
                    success: true,
                    email: newUser.email,
                    userId: newUser.id,
                });
            }
        } catch (error) {
            reject(error);
        }
    });

export const sendOTP = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { email, userId } = data;
            const new_otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });
            const hashOtp = await hashOTP(new_otp);
            const otp_expiry_time = new Date(Date.now() + 10 * 60 * 1000); // 10 Mins after otp is sent
            const user = await db.User.findOne({
                where: { id: userId },
                raw: false
            });
            if (user) {
                user.verifiedDate = otp_expiry_time
                user.verificationToken = hashOtp;
                await user.save();
            }
            // TODO send mail
            const message = `Hello ${user.userName},\n\nOTP for verification is ${new_otp}\n\nNote: This OTP is valid for next 10 mins.\n\nThanks`;
            await sendEmail({
                email: email,
                subject: "Verification OTP",
                message,
            });
            resolve({
                status: "success",
                message: 'OTP Sent Successfully!',
            });
        } catch (error) {
            reject(error);
        }
    });

export const verifyOTP = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            userData.errMessage = null;
            userData.user = {};
            userData.isAuthenticated = false;
            const { email, otp } = data;
            let user = await db.User.findOne({
                where: {
                    email: email,
                    verifiedDate: {
                        [Op.gt]: Date.now(),
                    },
                },
                raw: false
            });

            if (user) {
                let check = correctOTP(otp, user.verificationToken);
                if (check) {
                    if (!user.isVerified) {
                        const { accessToken, refreshToken } = jwtCreate(user.id)
                        user.isVerified = true;
                        user.verificationToken = null;
                        user.refreshToken = refreshToken;
                        await user.save();
                        userData.user = {
                            id: user.id,
                            userName: user.userName,
                            email: user.email,
                            avatarUrl: user.avatarUrl,
                            isAdmin: user.isAdmin,
                            createdAt: user.createdAt
                        }
                        userData.isAuthenticated = true;
                        userData.accessToken = accessToken;
                    } else {
                        userData.errMessage = 'Email is already verified'
                    }
                } else {
                    userData.errMessage = 'OTP is incorrect'
                }
            }
            else {
                userData.errMessage = 'Email is invalid or OTP expired'
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });

export const login = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            userData.errMessage = null;
            userData.user = {};
            userData.isAuthenticated = false;
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //User already exist
                let user = await db.User.findOne({
                    where: { email: email },
                    raw: false
                });
                if (user) {
                    //compare password->
                    let check = await comparePassword(password, user.password);

                    if (check) {
                        const { accessToken, refreshToken } = jwtCreate(user.id);
                        await db.User.update(
                            {
                                refreshToken: refreshToken,
                            },
                            { where: { id: user.id } }
                        );
                        userData.user = {
                            id: user.id,
                            userName: user.userName,
                            email: user.email,
                            avatarUrl: user.avatarUrl,
                            isAdmin: user.isAdmin,
                            createdAt: user.createdAt
                        }
                        userData.isAuthenticated = true;
                        userData.accessToken = accessToken;
                    } else {
                        userData.errMessage = 'Wrong password';
                    }
                    //<-compare password
                } else {
                    userData.errMessage = `User's not found`;
                }
            } else {
                //return error
                userData.errMessage = "Your Email isn't exits in your system. Plz try other email"
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
export const loginSuccess = ({ id, tokenLogin }) =>
    new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            userData.errMessage = null;
            userData.user = {};
            userData.isAuthenticated = false;
            let u = await db.User.findAll({
                raw: true,
            })
            let user = await db.User.findOne({
                where: {
                    id: id
                },
                raw: false
            })
            if (user) {
                const { accessToken, refreshToken } = jwtCreate(user.id);
                user.refreshToken = refreshToken
                await user.save();
                userData.user = {
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    isAdmin: user.isAdmin,
                    createdAt: user.createdAt
                }
                userData.isAuthenticated = true;
                userData.accessToken = accessToken;
                //<-compare password
            } else {
                userData.errMessage = `User's not found`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })

export const forgotPassword = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            userData.errMessage = null;
            userData.user = {};
            // 1) Get user based on POSTed email
            let user = await db.User.findOne({
                where: {
                    email: data.body.email,
                },
                raw: false
            });
            if (user) {
                // 2) Generate the random reset token
                // let refreshToken = jwt.sign(
                //     {
                //         id: user.id,
                //     },
                //     env.REFRESH_TOKEN,
                //     { expiresIn: "30s" }
                // )
                const { resetPasswordToken } = jwtCreate(user.id)
                user.passwordTokenExpire = new Date(Date.now() + 5 * 60 * 1000);
                user.passwordToken = resetPasswordToken;
                await user.save();
                let resetURL = '';
                resetURL = `${env.FRONTEND_URL}/auth/jwt/reset-password/${resetPasswordToken}`;
                const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetURL}\n\nIf you have not requested this email then, please ignore it.\n\nThis reset password link will be valid only for 5 minutes.`;
                await sendEmail({
                    email: user.email,
                    subject: "Reset Password",
                    message,
                });
                userData.message = `Email sent to ${user.email} successfully`;
                userData.user = {
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    isAdmin: user.isAdmin,
                    createdAt: user.createdAt
                }
            } else {
                userData.errMessage = 'There is no user with email address';
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });

export const resetPassword = (token, data) =>
    new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            userData.errMessage = null;
            // 1) Get user based on the token
            const verifyToken = jwtVerify(token.token);

            // 2) If token has not expired, and there is user, set the new password
            if (verifyToken) {
                let user = await db.User.findOne({
                    where: {
                        passwordToken: token.token,
                        passwordTokenExpire: {
                            [Op.gt]: Date.now(),
                        },
                    },
                    raw: false
                });
                let hashPasswordFromBcrypt = await hashPassword(data.password);
                user.password = hashPasswordFromBcrypt;
                user.passwordToken = null;
                user.passwordTokenExpire = null;
                await user.save();
                userData.success = true;
            } else {
                userData.errMessage = "Token is invalid or has expired";
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
// // Refresh Token
// export const refreshToken = (refresh_token) =>
//     new Promise(async (resolve, reject) => {
//         try {
//             const response = await db.User.findOne({
//                 where: { refresh_token },
//                 raw: true,
//             });
//             if (response) {
//                 jwt.verify(
//                     refresh_token,
//                     process.env.JWT_SECRER_REFRESH_TOKEN,
//                     (err) => {
//                         if (err) {
//                             resolve({
//                                 err: 1,
//                                 mes: "Refresh Token Expried. Require Login again!",
//                             });
//                         } else {
//                             const accessToken = jwt.sign(
//                                 {
//                                     id: response.id,
//                                     email: response.email,
//                                     password: response.password,
//                                     role_code: response.role_code,
//                                 },
//                                 process.env.JWT_SECRET,
//                                 { expiresIn: "10s" }
//                             );
//                             resolve({
//                                 err: accessToken ? 0 : 1,
//                                 mes: accessToken
//                                     ? "OK"
//                                     : "Fail to generate new access token. Let try more times",
//                                 access_Token: `Bearer ${accessToken}`,
//                                 refresh_token: refresh_token,
//                             });
//                         }
//                     }
//                 );
//             }
//         } catch (error) {
//             console.log(error);
//             reject(error);
//         }
//     });