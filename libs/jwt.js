const jwtToken = require('jsonwebtoken');
const EXPIRES = '15d';
const SECRET = 'eyJ0aXRsZSI6ImZ1Y2sgeW91IHBheSBtZSIsImxlYWQiOiJ0';

function generateToken (mail, id, password, opts = {}) {
    const payload = { mail, id, password };
    const tokenOpts = {};
    if (!opts.neveExpire) {
        tokenOpts.expiresIn = EXPIRES;
    }

    return jwtToken.sign(payload, SECRET, tokenOpts);
}

module.exports = generateToken;