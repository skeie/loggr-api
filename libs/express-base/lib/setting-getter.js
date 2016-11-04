'use strict';

module.exports = function (name, req) {
    if (name && req) {
        return req.app.locals.config[name];
    } else {
        return r => r.app.locals.config[name];
    }
};
