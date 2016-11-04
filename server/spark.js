'use strict';

require('../libs/process-exception-handlers');

const events = require('events');
const { join } = require('path');
const logger = require('../libs/fruits-logger');
const configLoader = require('../libs/config-loader');
const createServer = require('./lib/server-impl');
const config = configLoader(join(__dirname, 'config'), process.env);
const eventBus = new events.EventEmitter();
logger.setLogLevel(config.LOG_LEVEL);

createServer({ config, eventBus })
    .listen(config.PORT, () => {
        logger.info(`Listening on port ${config.PORT}`);
    })
    .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            logger.error(`Port ${config.PORT} is already bound, please choose another port with env PORT=$port`);
            process.exit(1);
        } else {
            throw err;
        }
    });
