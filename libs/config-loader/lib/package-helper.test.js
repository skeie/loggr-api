'use strict';

const assert = require('power-assert');
const proxyquire = require('proxyquire');

const sinon = require('sinon');
const readPkgUpStub = {
    sync: sinon.stub(),
};

describe('configLoader', () => {
    it('should throw on missing package.json', () => {
        readPkgUpStub.sync.returns(null);

        assert.throws(() => {
            proxyquire('./package-helper', { 'read-pkg-up': readPkgUpStub });
        });
    });

    it('should return object', () => {
        readPkgUpStub.sync.returns({
            path: process.cwd(),
            pkg: {},
        });
        const { pkg, pkgDir } = proxyquire('./package-helper', { 'read-pkg-up': readPkgUpStub });

        assert(pkgDir);
        assert(pkg);
    });
});
