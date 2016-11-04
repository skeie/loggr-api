'use strict';

const os = require('os');
const Gauge = require('prom-client/lib/gauge');

module.exports = function osLoadMetrics () {
    const osGauge = new Gauge('nodejs_os_load', 'OS Load');

    return () => {
        osGauge.set(os.loadavg()[0]);
    };
};
