// const asyncWrapper = require("~/middlewares/asyncWrapper");
// const db = require("~/models/index");
// const jwt = require("jsonwebtoken");
// const ErrorHandler = require("~/utils/errorHandler");
// import { env } from '~/config/environment';

// export const isAuthenticatedUser = asyncWrapper(async (req, res, next) => {
//     const token = req.cookies.access_token;
//     // console.log('Token xac thuc', req.cookies);
//     // if there is no token found
//     if (!token) {
//         return next(new ErrorHandler("Please Login to access this resource", 401));
//     }

//     // now verify that token with seceret key . 
//     const deCodeToken = jwt.verify(token, env.JWT_SECRET);

//     // now get user id from deCodeToken because when we make token in userSchema so we added userID in payLoad section. with that id get user and store inside req object .
//     const user = await db.User.findById(deCodeToken.id);

//     req.user = user; // now we have user in req.user

//     next();
// });

// // taking role as param and converting it into array using spread operator. for using array method
// export const authorizeRoles = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(
//                 new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resouce `, 403)
//             )
//         }
//         next();
//     };
// };
const { UnauthorizedError } = require("~/errors");
const { jwtVerify } = require("~/utils/jwt");
// const { getAccessTokenFromHeaders } = require('~/utils/header');
const { StatusCodes } = require("http-status-codes");
const { User } = require('~/models')

const auth = async (req, res, next) => {
    try {
        let accessToken = '';
        const nameEQ = 'access_token=';
        const ca = req.headers.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            const c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                accessToken = c.substring(nameEQ.length, c.length);
                break;
            }
        }
        console.log(accessToken);
        // const { accessToken } = getAccessTokenFromHeaders(req.headers)
        // const accessToken = req.cookies.access_token;
        if (!accessToken) throw new UnauthorizedError("UnAuthorized");
        const { id } = jwtVerify(accessToken);
        const user = await User.findOne({ where: { id: id } });
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: error.message,
                status: error.statusCode
            })
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "unauthorized",
            status: StatusCodes.UNAUTHORIZED
        })
    }
};

const authPermission = async (req, res, next) => {
    try {
        let accessToken = '';
        const nameEQ = 'access_token=';
        const ca = req.headers.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            const c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                accessToken = c.substring(nameEQ.length, c.length);
                break;
            }
        }
        if (!accessToken) throw new UnauthorizedError("unauthorized");
        const { id } = jwtVerify(accessToken);
        const user = await User.findOne({ where: { id: id } });
        if (!user.isAdmin) throw new UnauthorizedError("unauthorized");
        next()
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: error.message,
                status: error.statusCode
            })
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

module.exports = {
    auth,
    authPermission,
};