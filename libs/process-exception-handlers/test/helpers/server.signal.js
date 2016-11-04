'use strict';

require('../../');


// report that process has started

process.send({
    ready: true,
});


// keep process alive for 1500ms

setTimeout(() => {
    process.stdout.write('died');
}, 1500);
