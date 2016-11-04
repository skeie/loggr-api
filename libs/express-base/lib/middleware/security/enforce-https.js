'use strict';

module.exports = function () {
    return function (req, res, next) {
        const isSecure = req.headers['x-secure'];
        const didRedirect = req.url.includes('didRedirect');
        const isGetRequest = req.method === 'GET';
        const host = req.headers.host && req.headers.host.split(':')[0];
        if (!host || !isGetRequest || isSecure || didRedirect) {
            next();
        } else {
            const separator = req.url.includes('?') ? '&' : '?';
            const secureUrl = `https://${host}${req.url}${separator}didRedirect=true`;
            res.redirect(301, secureUrl);
        }
    };
};
