# Config loader

[![Build Status](https://travis.schibsted.io/finn/config-loader.svg?token=QJD2QsedthZfk9gV96zW)](https://travis.schibsted.io/finn/config-loader)

## Purpose

This package loads and parses [envalid schemas](https://github.com/af/envalid) from one or more directories.

## Usage

First, create directories containing your schemas as modules. For example, to add messaging configuration, one could add a `config/messaging.js` schema as a module that defines three config options. The `DELIVER_SMS` option is a boolean, with a default set for the dev environment. There is no non-dev default set, meaning that the app will crash on production startup unless `DELIVER_SMS` is provided as an environment variable.

```javascript
const { bool, url, string } = require('envalid');

module.exports = {
    DELIVER_SMS_ENABLED: bool({
        desc: 'Enable to send SMS from the app',
        devDefault: false,
    }),

    SMS_HELP_URL: url({
        desc: 'URL included in SMSes, for users to get help',
        default: 'http://help.finn.no/'
    }),

    SMS_SIGNOFF: string({
        desc: 'String added as signoff message to SMSes'
        default: 'Hilsen FINN.no',
        devDefault: 'THIS IS A DEBUG MESSAGE'
    }),
};
```

Then, parse the schemas using `configLoader(<path1>, [path2, ...])` to get the configuration. Absolute paths and paths relative to your `package.json` file are supported. However, schemas outside of your project cannot be loaded for security reasons. Any file in the `config` directory is assumed to be a config schema. Thus creating the file and having it export a schema is enough for it to be loaded.

```javascript
const configLoader = require('@finn-no/config-loader');
// Using one dir:
const config = configLoader('/my/project/config');
// Using one dir with relative location:
const config = configLoader('config');
// Using multiple dirs:
const config = configLoader('/my/project/config', '/my/project/more-config');
```

The returned object is immutable, and contains key/value pairs for the various configuration options defined for the app.

```
if (config.DELIVER_SMS_ENABLED) {
    sendSms();
}
```

Trying to update the config values, and accessing non-existing keys **will throw**. Doing so ensures immutability of the config object and reduces the consequence of typos and missing configuration by failing fast.

The following keys are always included in addition to your own configuration.

- `APP_NAME`: the application name, taken from `package.json`.
- `APP_VERSION`: the application version, taken from `package.json`.


## Display configuration

Add the following script to your `package.json` to display the result of the parsed configuration.

```json
"scripts": {
    "config:show": "show-config path/to/config/dir path/to/other/configdir"
}
```

Run with `npm run config:show`.
