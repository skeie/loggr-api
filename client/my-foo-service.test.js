'use strict';

const assert = require('power-assert');
const myFooService = require('./my-foo-service');

describe('my service', () => {
    it('should bark', () => {
        assert(myFooService.bark() === 'woff');
    });

    it('should list animals', () => {
        assert.deepEqual(myFooService.animals, ['octopus', 'dog']);
    });

    it('should describe an octopus', () => {
        assert.deepEqual(myFooService.octopus(8), {
            arms: 8,
            defense: ['ink', 'speed'],
            hasBones: false,
        });
    });
});
