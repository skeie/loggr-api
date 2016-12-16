'use strict';

const logger = require('../../libs/fruits-logger');
const { str, num, bool } = require('envalid');

module.exports = {
    METRICS_ENABLED: bool({
        desc: 'Enable to collect metrics',
        default: true,
    }),
    LOG_LEVEL: str({
        desc: 'What log level to use',
        choices: Object.keys(logger.logLevels),
        default: 'INFO',
        devDefault: 'TRACE',
    }),
    PORT: num({
        desc: 'The port to expose the application on',
        default: 8011,
    }),
};
