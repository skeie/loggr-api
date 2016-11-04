'use strict';

const userToken = require('./user-token');
const getTokenFromRequest = userToken.getTokenFromRequest;
const assert = require('power-assert');

describe('user token middleware', () => {
    it('should append usertoken to req', () => {
        const req = { cookies: { __routes_dev: '1234' } }; // eslint-disable-line camelcase
        const res = {};
        userToken('dev')(req, res, () => {});
        assert(req.userToken === '1234');
    });

    it('should provide implementation that can be used directly on request', () => {
        const result = getTokenFromRequest('name', { cookies: { name: '12' } });
        assert(result === '12');
    });

    it('should pick up bearer token', () => {
        const result = getTokenFromRequest('__routes_dev', { headers: { authorization: 'Bearer 123' } });
        assert(result === '123');
    });
});
