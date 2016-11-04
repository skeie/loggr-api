import test from 'ava';
import { stripColor } from 'chalk';

import humanReadable from '../../lib/humanReadable';

const object = {
    '@version': 1,
    '@timestamp': '2016-07-15T11:19:16.013Z',
    'level': 'DEBUG',
    'message': 'some message',
    'finn_app': 'my-wonderful-app',
    'LocationInfo': {
        file: '/src/file.js',
        module: 'some-module',
    },
};

const logHour = new Date(object['@timestamp']).getHours();

test('print correct string', t => {
    const msg = stripColor(humanReadable(JSON.stringify(object)));

    t.true(msg === `[${logHour}:19:16.013] [DEBUG] - some message`);
});

test('print correct string with custom logger name', t => {
    const msg = stripColor(humanReadable(JSON.stringify(Object.assign({ logger: 'some logger name' }, object))));

    t.true(msg === `[${logHour}:19:16.013] [DEBUG] [some logger name] - some message`);
});

test('print correct string with stacktrace', t => {
    const msg = stripColor(humanReadable(JSON.stringify(Object.assign({ throwable: 'some stack' }, object))));

    t.true(msg === `[${logHour}:19:16.013] [DEBUG] - some message - some stack`);
});

test('print correct string with extras', t => {
    const msg = stripColor(humanReadable(JSON.stringify(Object.assign({ extras: { someObject: { with: 'string' } } }, object))));

    t.true(msg === `[${logHour}:19:16.013] [DEBUG] - some message - { someObject: { with: 'string' } }`);
});
