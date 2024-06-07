// this method will take user Data status code and res =>  Then Create Token and will saving in cookie ans send

const sendJWtToken = (user, statusCode, res) => {

    const token = user.getJWTToken(); //every user has access all userModel methods
    // console.log('Token dang ky', token);

    res.cookie("access_token", token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    }).status(statusCode).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendJWtToken;

