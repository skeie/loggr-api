'use strict';

const prometheusMetrics = require('../../prometheus-metrics');

exports.startMonitoring = ({ enable }) => {
    if (!enable) {
        return;
    }

    prometheusMetrics.startMeasuring();
};
