'use strict';

module.exports = (path, middleware) => (
    (req, res, next) => {
        if (req.path && req.path.match(path)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    }
);
