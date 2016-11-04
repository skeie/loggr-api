'use strict';

const requireDir = require('require-dir');
const envalid = require('envalid');
const { isAbsolute, posix, resolve, sep } = require('path');

function mergeSchemas (schemas) {
    return Object.assign({}, ...Object.keys(schemas).map(e => schemas[e]));
}

function makeImmutable (mutable) {
    return new Proxy(mutable, {
        get (target, name) {
            // This check is needed because calling console.log on a
            // proxy that throws crashes the entire process. This whitelists
            // The necessary properties for `console.log(config)` to work.
            if (['inspect', Symbol.toStringTag].includes(name)) {
                return mutable[name];
            }

            const val = mutable[name];
            if (val === undefined) {
                throw new Error(`Config key not found: ${name}`);
            } else {
                return val;
            }
        },

        set (name) {
            throw new Error(`Config values can not be changed: ${name}`);
        },
    });
}

module.exports = (pkg, pkgDir) => {
    function loadSchemasFromDirs (...paths) {
        return paths
            .map(p => p.replace(new RegExp(posix.sep, 'g'), sep))
            .map(p => (isAbsolute(p) ? p : resolve(pkgDir, p)))
            .reduce((prev, curPath) => {
                if (!curPath.startsWith(pkgDir)) {
                    throw new Error(`Trying to access settings from outside of project! Tried ${curPath}`);
                }

                return Object.assign(prev, requireDir(curPath));
            }, {});
    }


    function initConfigFromDirs (paths, ...envs) {
        const fullSchema = mergeSchemas(loadSchemasFromDirs(paths));
        return initConfig(fullSchema, ...envs);
    }

    function initConfig (schema, ...envs) {
        const env = Object.assign({}, ...envs);
        const config = envalid.cleanEnv(env, schema, { strict: true });
        return makeImmutable(Object.assign({}, config, getAppInfo()));
    }

    function getAppInfo () {
        return {
            APP_NAME: pkg.name,
            APP_VERSION: pkg.version,
        };
    }

    return {
        initConfig, initConfigFromDirs, loadSchemasFromDirs,
    };
};

