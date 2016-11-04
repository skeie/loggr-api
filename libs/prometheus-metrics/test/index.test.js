'use strict';

const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('Module API', () => {
    let mockedClock;

    let promdMetrics;

    beforeEach(() => {
        mockedClock = sinon.useFakeTimers();

        promdMetrics = proxyquire('..', {});
    });

    afterEach(() => {
        mockedClock.restore();
        promdMetrics.stopMeasuring();
    });

    describe('addProbes()', () => {
        it('requires new probes to be a function', () => {
            const invalidProbe = {};
            const validProbe = () => {
            };

            assert.throws(() => {
                promdMetrics.addProbe(invalidProbe);
            });

            assert.doesNotThrow(() => {
                promdMetrics.addProbe(validProbe);
            });
        });
    });

    describe('startMeasuring()', () => {
        it('should ask probes to report their metrics every 10 seconds', () => {
            const spyProbeReturned = sinon.spy();
            const spyProbe = sinon.stub();
            spyProbe.returns(spyProbeReturned);

            promdMetrics.addProbe(spyProbe);

            promdMetrics.startMeasuring();

            mockedClock.tick(10000);
            assert(spyProbe.calledOnce);
            assert(spyProbeReturned.calledTwice);
        });
    });
});
