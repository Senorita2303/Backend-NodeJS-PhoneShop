const getAccessTokenFromHeaders = ({ authorization }) =>
    ({ accessToken: authorization?.split(' ')[1] })

module.exports = {
    getAccessTokenFromHeaders
}