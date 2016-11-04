'use strict';

const express = require('express');
const prometheusRegister = require('prom-client/lib/register');
const Brakes = require('brakes');

const brakesGlobalStats = Brakes.getGlobalStats();

module.exports = (opts) => {
    const router = express.Router(); // eslint-disable-line new-cap

    router.get('/prometheus', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(prometheusRegister.metrics());
    });

    router.get('/hystrix.stream', (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream;charset=UTF-8',
            'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            'Pragma': 'no-cache',
        });
        brakesGlobalStats.getHystrixStream().pipe(res);
    });

    router.get('/', ({ headers }, res) => {
        res.send({ headers, processVersions: process.versions });
    });

    return router;
};
