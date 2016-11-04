'use strict';

const promClient = require('../index.js');
const Counter = require('prom-client/lib/counter');
const register = require('prom-client/lib/register');

promClient.startMeasuring();

// Add a custom counter
const counter = new Counter('simple_counter', 'just a test');

setInterval(() => {
    counter.inc();
    console.log(register.metrics());
}, 1000);
