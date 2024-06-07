const jwt = require('jsonwebtoken')
import { env } from '~/config/environment';
const jwtCreate = (id) => {
    try {
        const accessToken = jwt.sign({ id }, env.ACCESS_TOKEN, {
            expiresIn: "1d",
        });
        const resetPasswordToken = jwt.sign({ id }, env.ACCESS_TOKEN, {
            expiresIn: "5m",
        });
        const refreshToken = jwt.sign(
            { id },
            env.REFRESH_TOKEN,
            { expiresIn: "15d" }
        );

        return { accessToken, refreshToken, resetPasswordToken };
    } catch (error) {
        console.log(`Error in create jwt token: ${error}`);
        return null
    }
};

const jwtDecodeToken = (accessToken) => {
    try {
        return jwt.verify(accessToken, env.ACCESS_TOKEN, {
            ignoreExpiration: true,
        });
    } catch (error) {
        console.log(`Error in decode access token: ${error}`);
        return null;
    }
}

const jwtVerify = (accessToken) => {
    return jwt.verify(accessToken, env.ACCESS_TOKEN);
};

module.exports = {
    jwtCreate,
    jwtDecodeToken,
    jwtVerify,
}