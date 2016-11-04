'use strict';

const url = require('url');

const logger = require('../../../../fruits-logger');


const WHITELIST = [
    '127.0.0.1',
    '0.0.0.0',
    'localhost',
    'routes.guide',
    'www.routes.guide',
];

function isWhitelisted (whitelist, hostname) {
    return whitelist.some(entry => hostname.startsWith(entry));
}

module.exports = (whitelistAdditions = []) => {
    const whitelist = WHITELIST.concat(whitelistAdditions);

    return (req, res) => {
        const location = res.get('location');
        if (location) {
            const hostname = url.parse(location).hostname;
            if (hostname && !isWhitelisted(whitelist, hostname)) {
                logger.warn(`Redirection attempt to ${location} stopped. If the redirect was intentional, ` +
                    `please add the hostname ${hostname} to the redirect whitelist.`);

                res.set('location', '/');
            }
        }
    };
};
