'use strict';

const Gauge = require('prom-client/lib/gauge');

module.exports = function cpuLoadMetrics () {
    // Don't do anything if the function doesn't exist (introduced in node@6.1.0)
    if (typeof process.cpuUsage !== 'function') {
        return () => {
        };
    }

    const cpuUserGauge = new Gauge('nodejs_cpu_usage_user', 'CPU Usage User');
    const cpuSystemGauge = new Gauge('nodejs_cpu_usage_system', 'CPU Usage System');

    return () => {
        const cpuUsage = process.cpuUsage();

        cpuUserGauge.set(cpuUsage.user);
        cpuSystemGauge.set(cpuUsage.system);
    };
};
