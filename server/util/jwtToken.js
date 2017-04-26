const jwtToken = require('jsonwebtoken');
const jwt = require('express-jwt');

export const secret =
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

export function hasUserAuth(req, res, next) {
    const token = _fromHeaderOrQuerystring(req, res);
    const urlUserId = req.params.userId;
    const loggedInUserId = req.user ? req.user.id : 0;
    if (parseInt(urlUserId, 10) !== loggedInUserId) {
        next({
            message: 'User is not authorized to perform this action',
            status: 401,
        });
    } else {
        next();
    }
}

function _fromHeaderOrQuerystring(req, res) {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        return req.headers.authorization.split(' ')[1];
    }
}
