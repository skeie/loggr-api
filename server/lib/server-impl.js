'use strict';

const logger = require('../../libs/fruits-logger');

const { middleware, server } = require('../../libs/express-base');

const events = require('./events');
const metrics = require('./metrics');

function startApp ({ config, eventBus }) {
    const app = server.initialize(({ config, eventBus }));

    app.get('/internal-backstage/health/readiness', (req, res) => {
        eventBus.emit(events.readinessRequest);
        res.sendStatus(204);
    });

    app.get('/internal-backstage/health/liveness', (req, res) => {
        eventBus.emit(events.livenessRequest);
        res.sendStatus(204);
    });

    app.get('/', (req, res) => {
            eventBus.emit(events.appRequest);
            logger.info(`Hey from index via KUB_ENVIRONMENT "${config.KUB_ENVIRONMENT}" and NODE_ENV "${config.NODE_ENV}"`);
            res.send({ message: 'Hello world' });
        });

    metrics.startMonitoring({ eventBus, enable: config.METRICS_ENABLED });

    server.errorHandling({ app });
    return app;
}

module.exports = startApp;
