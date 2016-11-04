# FiaaS Logger

[![Build Status](https://travis.schibsted.io/finn/node-fiaas-logger.svg?token=qt273uGfEz64UyWuNHJ1&branch=master)](https://travis.schibsted.io/finn/node-fiaas-logger)

A common module to use for logging when building applications in a FiaaS context, aiming to fulfill the
[FiaaS Logging Contract][fiaas-logging-contract-link] with as little needed as possible from the application
developer.

The module automatically sniffs out what file it's called from, what module, and what app it's run in.

The result is logged to stdout. The JSON string (call `JSON.parse` on it if you want) is always returned to the caller, which can then be
logged however you want (e.g. write to disk). If `process.env.LOG_FORMAT=json`, the output is a JSON string, but if it's not set a colorized
string in the format of `[timestamp] [level] [logger name] - message - stacktrace` is printed.

You can also intercept stdout and parse the JSON string yourself if you want to, using e.g. [intercept-stdout](https://github.com/sfarthin/intercept-stdout).

## Installation instructions

```sh
$ npm install --save @finn-no/fiaas-logger
```

## Usage

There are 6 logging levels exported:

```js
const logger = require('@finn-no/fiaas-logger');

logger.trace('some message');
logger.debug('some message');
logger.info('some message');
logger.warn('some message');
logger.error('some message');
logger.fatal('some message');
```

### API

#### Log

The API is `message: string, error: Error, data: object`. `error` as the first argument is also supported. The `data` object should match
(at least) all `wanted` fields in the [contract][fiaas-logging-contract-link]. If any is missing, please open an issue (or a PR).  It
currently has 6 fields, all of which are optional:

##### `finnApp`
type: `string`, default: name of top level module (running app, in practice)

Is set to `finn_app` in the [contract][fiaas-logging-contract-link].

##### `logger`
type: `string`, default: `null`

Matches `logger` in the [contract][fiaas-logging-contract-link].

##### `clientIp`
type: `string`, default: `null`

Is set to `client_ip` in the [contract][fiaas-logging-contract-link].

##### `userId`
type: `string`, default: `null`

Is set to `user_id` in the [contract][fiaas-logging-contract-link].

##### `adId`
type: `string`, default: `null`

Is set to `ad_id` in the [contract][fiaas-logging-contract-link].

##### `extras`
type: `object`, default: `null`

If provided, is serialized and added under the `extras` key in the output.

#### Log level

You can set the log level, useful to suppress log output below a certain threshold.

```js
const logger = require('@finn-no/fiaas-logger');

logger.setLogLevel(logger.logLevels.WARN); // default is 'INFO'

logger.info('not so important'); // not printed

logger.error('important'); // printed
```

Log levels match the exported function names (in upper case). You can also pass `'ON'` or `'OFF'` to turn logging completely off (and on
again).

#### Fancy stack traces
[VError](https://github.com/joyent/node-verror)'s `VError.fullStack(err)` is used, so if your error is a `VError` or one of its derivatives,
it allows you to, amongst other things, have `caused by` in the stack trace.

## Supported environments

Node 4+ supported for now, will probably be Node 6+ only from October 1st, when Node 6 becomes LTS.



[fiaas-logging-contract-link]: https://confluence.schibsted.io/display/FI/Logging+contract
