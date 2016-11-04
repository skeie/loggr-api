'use strict';

const Counter = require('prom-client/lib/counter');
const events = require('./events');

exports.startMonitoring = ({ enable, eventBus }) => {
    if (!enable) {
        return;
    }

    // These metrics are just examples, they are probably not really interesting to keep around
    const appAccessCount = new Counter('app_request_total', 'App request Count');
    const readinessCheckCount = new Counter('readiness_probe_request_total', 'Readiness Probe Access Count');
    const livenessCheckCount = new Counter('liveness_probe_request_total', 'Liveness Probe Access Count');

    eventBus.on(events.readinessRequest, () => {
        readinessCheckCount.inc();
    });

    eventBus.on(events.livenessRequest, () => {
        livenessCheckCount.inc();
    });

    eventBus.on(events.appRequest, () => {
        appAccessCount.inc();
    });
};
