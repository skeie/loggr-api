const jwtToken = require('jsonwebtoken');
const jwt = require('express-jwt');
const jwtDecode = require('jwt-decode');

let prevUser = {};

const secret =
    'qQDI9AO4LtMFC9NDMw9cM9PrFtEgkugW8Yie8R11LzzkNyjyLX1bmEKhoRoMKPm';

export function generateToken(user) {
    // if (!opts.neveExpire) {
    //     tokenOpts.expiresIn = config.token.expires;
    // }

    return jwtToken.sign(user, secret);
}

export function requireAuth() {
    return jwt({
        secret,
        credentialsRequired: true,
        getToken: _fromHeaderOrQuerystring,
    });
}

function _fromHeaderOrQuerystring(req, res) {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        const token = req.headers.authorization.split(' ')[1];
        logUser(token);
        return token;
    }
}

const logUser = token => {
    const user = jwtDecode(token);
    if (prevUser.id !== user.id) {
        console.log('user: ', user);
        prevUser = user;
    }
};
