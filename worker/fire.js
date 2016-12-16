require('../libs/process-exception-handlers');
const { join } = require('path');
const logger = require('../libs/fruits-logger');
const messageBus = require('../libs/MessageBus');
const configLoader = require('../libs/config-loader');
const pathToConfigs = join(__dirname, '..', 'server', 'config');
const config = configLoader(pathToConfigs, process.env);
logger.setLogLevel(config.LOG_LEVEL);

start();

function start() {
    logger.info(`Starting worker`);

    const bus = messageBus(config);
    bus.on('ready', beginWork);
    bus.on('lost', shutdown);

    function beginWork() {
        logger.info(`Worker running with NODE_ENV=${config.NODE_ENV}!`);        
        bus.subscribeToMessageBus();
    }

    function shutdown() {
        logger.info({ type: 'info', msg: 'shutting down' });
        process.exit();
    }
}