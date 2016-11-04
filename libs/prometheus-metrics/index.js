'use strict';

const defaultMetrics = require('prom-client/lib/defaultMetrics');
const register = require('prom-client/lib/register');
const prometheusGcStats = require('prometheus-gc-stats');

const probes = require('./lib/probes').concat(prometheusGcStats);
let invokedProbes;

/* constants */
const SECOND = 1000;

function reportAllProbes (allProbes) {
    allProbes.forEach(probe => probe());
}

function validateProbe (probe) {
    if (typeof probe !== 'function') {
        throw new Error('A probe must be a function!');
    }
}

module.exports = {
    addProbe (probe) {
        validateProbe(probe);
        probes.push(probe);
    },

    startMeasuring () {
        invokedProbes = probes.map(probe => probe());
        reportAllProbes(invokedProbes); // fire once now
        this.interval = setInterval(reportAllProbes, 10 * SECOND, invokedProbes).unref();
        this.defaultInterval = defaultMetrics([], 10 * SECOND);
    },

    stopMeasuring () {
        clearInterval(this.interval);
        clearInterval(this.defaultInterval);
        invokedProbes = [];
        register.clear();
    },

    metrics () {
        return register.metrics();
    },
};
