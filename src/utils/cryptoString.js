const { randomBytes } = require('crypto')

const createCryptoString = ({ length = 48 } = {}) =>
    randomBytes(length).toString('hex')

module.exports = {
    createCryptoString
}