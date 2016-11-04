'use strict';

const fork = require('child_process').fork;
const assert = require('power-assert');
const freshy = require('freshy');


describe('set a function as callback', () => {
    before(() => {
        this.mod = freshy.reload('../');
    });

    it('should return 0 for the first callback', (done) => {
        const index = this.mod.set(() => {
            // dummy function
        });
        assert(index === 0);
        done();
    });

    it('should return 1 for the second callback', (done) => {
        const index = this.mod.set(() => {
            // dummy function
        });
        assert(index === 1);
        done();
    });
});


describe('set a non function as callback', () => {
    before(() => {
        this.mod = freshy.reload('../');
    });

    it('should throw an error', (done) => {
        assert.throws(this.mod.set, Error, 'Attribute "callback" must be a function');
        done();
    });
});


describe('remove callbacks', () => {
    before(() => {
        this.mod = freshy.reload('../');
        this.cbA = this.mod.set(() => {
            // dummy function
        });
        this.cbB = this.mod.set(() => {
            // dummy function
        });
    });

    it('should return -1 for a non matching index', (done) => {
        const length = this.mod.remove(666);
        assert(length === -1);
        done();
    });

    it('should return initial length for the first removed callback', (done) => {
        const length = this.mod.remove(this.cbA);
        assert(length === 2);
        done();
    });

    it('should return  initial length for the second removed callback', (done) => {
        const length = this.mod.remove(this.cbA);
        assert(length === 2);
        done();
    });
});


describe('set timeout', () => {
    before(() => {
        this.mod = freshy.reload('../');
    });

    it('should return same value as set', (done) => {
        const timeout = this.mod.timeout(666);
        assert(timeout === 666);
        done();
    });
});


describe('run terminate callbacks', () => {
    before(() => {
        this.result = [];
        this.mod = freshy.reload('../');
        this.cbA = this.mod.set((next) => {
            this.result.push('a');
            next();
        });
        this.cbB = this.mod.set((next) => {
            this.result.push('b');
            next();
        });
        this.cbC = this.mod.set((next) => {
            this.result.push('c');
            next();
        });
        this.cbD = this.mod.set((next) => {
            this.result.push('d');
            next();
        });
    });

    it('should execute all callbacks in appended order', (done) => {
        this.mod.terminate(() => {
            assert(this.result.length === 4);
            assert(this.result.join('') === 'abcd');
            done();
        });
    });
});


describe('run terminate with no callbacks in terminate list', () => {
    before(() => {
        this.mod = freshy.reload('../');
    });

    it('should execute onDone callback', (done) => {
        this.mod.terminate(() => {
            assert(true);
            done();
        });
    });
});


describe('set timeout to 0, run terminate callbacks', () => {
    before(() => {
        this.result = [];
        this.mod = freshy.reload('../');
        this.mod.timeout(0);
        this.cbA = this.mod.set((next) => {
            this.result.push('a');
            next();
        });
        this.cbB = this.mod.set((next) => {
            this.result.push('b');
            next();
        });
        this.cbC = this.mod.set((next) => {
            this.result.push('c');
            next();
        });
        this.cbD = this.mod.set((next) => {
            this.result.push('d');
            next();
        });
    });

    it('should execute all callbacks in appended order', (done) => {
        this.mod.terminate(() => {
            assert(this.result.length === 4);
            assert(this.result.join('') === 'abcd');
            done();
        });
    });
});


describe('terminate process by signal "SIGINT"', () => {
    it('should terminate and return code 0', (done) => {
        const proc = fork('./test/helpers/server.signal.js');

        proc.on('message', (message) => {
            if (message.ready) {
                process.kill(proc.pid, 'SIGINT');
            }
        });

        proc.on('close', (code) => {
            assert(code === 0);
            done();
        });
    });
});


describe('terminate process by signal "SIGTERM"', () => {
    it('should terminate and return code 0', (done) => {
        const proc = fork('./test/helpers/server.signal.js');

        proc.on('message', (message) => {
            if (message.ready) {
                process.kill(proc.pid, 'SIGTERM');
            }
        });

        proc.on('close', (code) => {
            assert(code === 0);
            done();
        });
    });
});


describe('terminate process by signal "SIGHUP"', () => {
    it('should terminate and return code 0', (done) => {
        const proc = fork('./test/helpers/server.signal.js');

        proc.on('message', (message) => {
            if (message.ready) {
                process.kill(proc.pid, 'SIGHUP');
            }
        });

        proc.on('close', (code) => {
            assert(code === 0);
            done();
        });
    });
});


describe('process gets an uncaughtException', () => {
    it('should terminate and return code 1', (done) => {
        const proc = fork('./test/helpers/server.exception.js');

        proc.on('message', (message) => {
            if (message.ready) {
                proc.send({
                    kill: true,
                });
            }
        });

        proc.on('close', (code) => {
            assert(code === 1);
            done();
        });
    });
});


describe('process gets an unhandledRejection', () => {
    it('should terminate and return code 1', (done) => {
        const proc = fork('./test/helpers/server.rejection.js');

        proc.on('message', (message) => {
            if (message.ready) {
                proc.send({
                    kill: true,
                });
            }
        });

        proc.on('close', (code) => {
            assert(code === 1);
            done();
        });
    });
});
