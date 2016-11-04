require('../libs/process-exception-handlers');
const { join } = require('path');
const logger = require('../libs/fruits-logger');
const MessageBus = require('../libs/MessageBus');
const configLoader = require('../libs/config-loader');
const pathToConfigs = join(__dirname, '..', 'server', 'config');
const config = configLoader(pathToConfigs, process.env);
logger.setLogLevel(config.LOG_LEVEL);

start();

function start() {
    logger.info('Starting worker');

    const instance = MessageBus({ config });
    instance.on('ready', beginWork);
    instance.on('lost', shutdown);

    function beginWork() {
        instance.subscribeToMessageBus();
    }

    function shutdown() {
        logger.log({ type: 'info', msg: 'shutting down' });
        process.exit();
    }
}