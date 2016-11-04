'use strict';

const logger = require('../../fruits-logger');
const isFn = require('lodash.isfunction');
const deathrow = [];
let timeout = 2000;


/**
  * Append a function to the termination list.
  *
  * @param {Function} callback Function to be run upon termination
  * @returns {Number} Id of the function in the termination registry
  */
module.exports.set = function (callback) {
    if (!isFn(callback)) {
        throw new Error('Attribute "callback" must be a function');
    }
    const index = deathrow.push(callback);
    return index - 1;
};


/**
  * Remove a function from the termination registry.
  *
  * @param {Number} id Id of the function in the termination registry
  * @returns {Number} Number of functions in the termination registry (including removed once)
  */
module.exports.remove = function (id) {
    if (id >= deathrow.length) {
        return -1;
    }
    deathrow[id] = null;
    return deathrow.length;
};


/**
  * Set a new timeout.
  * NOTE: If set to 0, timeout will be omitted. If one of the functions in
  * the termination list does not terminate, the shutdown process can halt.
  *
  * @param {Number} time Timeout in milliseconds
  * @returns {Number} The new timeout
  */
module.exports.timeout = function (time) {
    timeout = time;
    return timeout;
};


/**
  * Execute all functions in the termination registry.
  *
  * @param {Function} onDone Function to be run when all functions in the
  * termination registry have run
  */
const terminate = module.exports.terminate = function (onDone) {
    if (deathrow.length === 0) {
        return onDone();
    }

    const id = (timeout === 0) ? timeout : setTimeout(onDone, timeout);

    const terminator = (index) => {
        if (index >= deathrow.length) {
            clearTimeout(id);
            return onDone();
        }

        deathrow[index](() => {
            terminator(index + 1);
        });
    };
    terminator(0);
};


/**
 * Intercept uncaught exceptions and terminate the server process with
 * an error code of 1.
 */
process.on('uncaughtException', err => {
    terminate(() => {
        logger.error('global uncaught exception - terminating with error.', err);
        process.exitCode = 1;
        process.nextTick(() => {
            process.exit(1);
        });
    });
});


/**
 * Intercept unhandled promise rejections and therminate the server process
 * with an error code of 1.
 */
process.on('unhandledRejection', err => {
    terminate(() => {
        logger.error('global uncaught promise rejection - terminating with error.', err);
        process.exitCode = 1;
        process.nextTick(() => {
            process.exit(1);
        });
    });
});


/**
 * Listen for SIGINT and terminate the server process
 * with an error code of 0
 * SIGINT can be sent with ctrl+c
 */
process.on('SIGINT', () => {
    terminate(() => {
        logger.info('shutdown - got SIGINT - terminating gracefully');
        process.exitCode = 0;
        process.nextTick(() => {
            process.exit(0);
        });
    });
});


/**
 * Listen for SIGTERM and terminate the server process
 * with an error code of 0
 * SIGTERM can be triggered by upstart.
 */
process.on('SIGTERM', () => {
    terminate(() => {
        logger.info('shutdown - got SIGTERM - terminating gracefully');
        process.exitCode = 0;
        process.nextTick(() => {
            process.exit(0);
        });
    });
});


/**
 * Listen for SIGHUP and terminate the server process
 * with an error code of 0
 * SIGHUP can be triggered the controlling terminal being closed.
 */
process.on('SIGHUP', () => {
    terminate(() => {
        logger.info('shutdown - got SIGHUP - terminating gracefully');
        process.exitCode = 0;
        process.nextTick(() => {
            process.exit(0);
        });
    });
});
