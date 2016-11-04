'use strict';

const { errorHandling, initialize } = require('./express-base');
// const featureToggles = require('./middleware/featureToggles');

exports.server = {
    initialize,
    errorHandling,
};

exports.middleware = {
    // featureToggles,
};
