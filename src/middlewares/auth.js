const { UnauthorizedError } = require("~/errors");
const { jwtVerify } = require("~/utils/jwt");
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