'use strict';

require('../../');


// report that process has started

process.send({
    ready: true,
});


// on kill message, throw an uncaught exception

process.on('message', (message) => {
    if (message.kill) {
        Promise.reject(new Error());
    }
});


// keep process alive for 1500ms

setTimeout(() => {
    process.stdout.write('died');
}, 1500);
