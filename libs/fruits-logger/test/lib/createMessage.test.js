import test from 'ava';
import cleanStack from 'clean-stack';
import VError from 'verror';

import createMessage from '../../lib/createMessage';

// Create error here to have the same stack trace
const commonError = new Error('This is an error');

const expectedPlain = {
    '@version': 1,
    'level': 'DEBUG',
    'message': 'some message',
    'finn_app': 'my-wonderful-app',
    'LocationInfo': {
        file: '/src/file.js',
        module: 'some-module',
    },
};

const expectedError = Object.assign({}, expectedPlain, { throwable: cleanStack(commonError.stack) });

test('no error', t => {
    const msg = createMessage('DEBUG', 'some message', null, null, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    t.deepEqual(parse, expectedPlain);
});

test('error', t => {
    const msg = createMessage('DEBUG', 'some message', commonError, null, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    t.deepEqual(parse, expectedError);
});

test('VError as error', t => {
    const vError = new VError(commonError, 'Wrapped');
    const msg = createMessage('DEBUG', 'some message', vError, null, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedError, { throwable: cleanStack(VError.fullStack(vError)) });

    t.deepEqual(parse, expected);
});

test('error, no message', t => {
    const msg = createMessage('DEBUG', commonError, null, null, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedError, { message: 'Error: This is an error' });
    t.deepEqual(parse, expected);
});

test('error and data', t => {
    const msg = createMessage('DEBUG', 'some message', commonError, { logger: 'some cool name' }, 'some-module', '/src/file.js',
        'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedError, { logger: 'some cool name' });
    t.deepEqual(parse, expected);
});

test('error and data, no message', t => {
    const msg = createMessage('DEBUG', commonError, { logger: 'some cool name' }, null, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedError, { message: 'Error: This is an error', logger: 'some cool name' });
    t.deepEqual(parse, expected);
});

test('logger name', t => {
    const msg = createMessage('DEBUG', 'some message', null, { logger: 'some cool name' }, 'some-module', '/src/file.js',
        'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedPlain, { logger: 'some cool name' });
    t.deepEqual(parse, expected);
});

test('extras', t => {
    const msg = createMessage('DEBUG', 'some message', null, { extras: { someObject: { nested: 'prop' } } }, 'some-module', '/src/file.js',
        'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedPlain, { extras: { someObject: { nested: 'prop' } } });
    t.deepEqual(parse, expected);
});

test('extras number 0', t => {
    const msg = createMessage('DEBUG', 'some message', null, { extras: 0 }, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedPlain, { extras: 0 });
    t.deepEqual(parse, expected);
});

test('escape message', t => {
    const msg = createMessage('DEBUG', 'some message with \nline breaks', null, null, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedPlain, { message: 'some message with \nline breaks' });
    t.deepEqual(parse, expected);
});

test('finnApp', t => {
    const msg = createMessage('DEBUG', 'some message', null, { finnApp: 'this app name wins!' }, 'some-module', '/src/file.js',
        'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedPlain, { finn_app: 'this app name wins!' }); // eslint-disable-line camelcase
    t.deepEqual(parse, expected);
});

test('clientIp', t => {
    const msg = createMessage('DEBUG', 'some message', null, { clientIp: '1:2:3:4' }, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedPlain, { client_ip: '1:2:3:4' }); // eslint-disable-line camelcase
    t.deepEqual(parse, expected);
});

test('userId', t => {
    const msg = createMessage('DEBUG', 'some message', null, { userId: '12345' }, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedPlain, { user_id: '12345' }); // eslint-disable-line camelcase
    t.deepEqual(parse, expected);
});

test('adId', t => {
    const msg = createMessage('DEBUG', 'some message', null, { adId: '12345' }, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedPlain, { ad_id: '12345' }); // eslint-disable-line camelcase
    t.deepEqual(parse, expected);
});

test('data as second argument', t => {
    const msg = createMessage('DEBUG', 'some message', { adId: '12345' }, null, 'some-module', '/src/file.js', 'my-wonderful-app');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    const expected = Object.assign({}, expectedPlain, { ad_id: '12345' }); // eslint-disable-line camelcase
    t.deepEqual(parse, expected);
});

test('produce valid json on missing message', t => {
    const msg = createMessage('DEBUG');
    const parse = JSON.parse(msg);

    delete parse['@timestamp'];

    t.deepEqual(parse, {
        '@version': 1,
        'level': 'DEBUG',
        'message': null,
        'LocationInfo': { file: null, module: null },
    });
});
