const db = require("~/models");
const { comparePassword, jwtCreate, jwtVerify, hashPassword } = require('~/utils');
const cloudinary = require("cloudinary").v2;
const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
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
}

export const getUserDetails = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            userData.errMessage = null;
            let user = await db.User.findOne({
                where: {
                    id: data,
                },
                raw: false
            });
            const { accessToken } = jwtCreate(user.id);
            // let accessToken = jwt.sign(
            //     {
            //         id: user.id
            //     },
            //     env.ACCESS_TOKEN,
            //     { expiresIn: "15m", }
            // );
            userData.accessToken = accessToken;
            userData.user = {
                id: user.id,
                userName: user.userName,
                email: user.email,
                avatarUrl: user.avatarUrl,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
            };
            userData.isAuthenticated = true;
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });

export const updatePassword = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            console.log(data.user.id);
            let userData = {};
            userData.errMessage = null;
            userData.user = {};
            userData.success = false;
            let user = await db.User.findOne({
                where: {
                    id: data.user.id,
                },
                raw: false
            });

            const isMatched = await comparePassword(data.body.oldPassword, user.password); // user.comparePassword this method define in user Schema  for comapre given normal pass to save hash pass
            // when user not found
            if (isMatched) {
                if (data.body.newPassword === data.body.confirmPassword) {
                    let hashedPassword = await hashPassword(data.body.newPassword);
                    user.password = hashedPassword;
                    await user.save();
                    userData.user = {
                        id: user.id,
                        userName: user.userName,
                        email: user.email,
                        avatarUrl: user.avatarUrl,
                        isAdmin: user.isAdmin,
                        createdAt: user.createdAt
                    }
                    userData.success = true;
                } else {
                    userData.errMessage = "Password does not match";
                }
            }
            else {
                userData.errMessage = "Old password is incorrect";
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });

export const updateProfile = (data, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            userData.errMessage = null;
            userData.user = {};
            let user = await db.User.findOne({
                where: {
                    id: data.user.id,
                },
                raw: false,
            });
            if (!user) {
                userData.errMessage = "User not found"
            } else {
                const urlString = user.avatarUrl;
                const regex = /\/([^\/]+\/[^\/]+)\.[a-zA-Z0-9]+$/;
                let imageId = "";
                const match = urlString.match(regex);
                if (match) {
                    imageId = match[1];
                }
                if (fileData) {
                    await cloudinary.uploader.destroy(imageId);
                    user.avatarUrl = fileData?.path;
                }
                user.userName = data.body.userName;
                await user.save();
                userData.success = true;
                userData.user = {
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    isAdmin: user.isAdmin,
                    createdAt: user.createdAt
                }
            }

            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });

export const getSingleUser = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            userData.errMessage = null;
            userData.user = {};
            let user = await db.User.findOne({
                where: {
                    id: data,
                }
            });
            if (!user) {
                userData.errMessage = "User does not exist with Id"
            }
            else {
                userData.user = user;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
export const getAllUser = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findAll({});
            resolve({
                success: true,
                users: response,
            });
        } catch (error) {
            reject(error);
        }
    });
