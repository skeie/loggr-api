'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const logger = require('../../fruits-logger');
const urls = require('../../platform-urls');

const security = require('./middleware/security');
const userToken = require('./middleware/user-token');
const deviceType = require('./middleware/device-type');
const internalBackstageRoutes = require('./internal-backstage-routes');
const dbHandler = require('../../db-handler');

const metrics = require('./metrics');
const makeErrorViewHandler = require('./middleware/error');

const messageBus = require('../../MessageBus');

const formParser = bodyParser.urlencoded;
const jsonParser = bodyParser.json;

exports.initialize = ({ config }) => {

    const bus = messageBus(config);
    bus.on('lost', process.exit);

    const app = express();
    app.locals.config = config;
    app.locals.messageBus = bus;
    app.locals.dbHandler = dbHandler.initialize().db;
    app.locals.urls = urls;
    app.use(jsonParser());
    app.use(formParser({ extended: true }));
    app.use(cookieParser());
    app.use(expressValidator());
    // app.use(security({
    //     csrfProtection: config.CSRF_PROTECTION_ENABLED,
    //     useSecureCsrfCookie: config.SECURE_CSRF_COOKIE_ENABLED,
    //     enforceHttps: config.ENFORCE_HTTPS_ENABLED,
    //     maxContentLength: config.MAX_CONTENT_LENGTH,
    //     validateRedirects: config.VALIDATE_REDIRECTS_ENABLED,
    //     validateRedirectHostnameWhitelist: [],
    //     enableGlobalCors: config.GLOBAL_CORS_ENABLED,
    // }));
    // app.use(userToken(config.KUB_ENVIRONMENT));
    app.use(deviceType);

    metrics.startMonitoring({ enable: config.METRICS_ENABLED });

    app.use('/internal-backstage', internalBackstageRoutes({ }));

    return app;
};

exports.errorHandling = ({ app }) => {
    /**
     * Catch-all middleware. This must be registered after all the regular
     * routes. If it gets called, it means no other handler has dealt
     * with the request, thus a 404 response should be given.
     */
    app.use((req, res, next) => { // eslint-disable-line no-unused-vars
        res.status(404).send('Not found');
    });

    // Error logging to fiaas
    app.use((err, req, res, next) => {
        logger.error(err);
        next(err);
    });

    // web error logging
    app.use(makeErrorViewHandler());

    /**
     * terminates error handling, preventing default express handler
     * Also a final escape hatch if something failed in the web error view
     * middleware. In which case we log the error that occured in the error
     * handler.
     */
    app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
        if (!res.headersSent) {
            res.sendStatus(500);
            logger.error(err);
        }
    });
};
