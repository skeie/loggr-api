'use strict';

const { str } = require('envalid');

// TODO: dont do this logic here, configure
// the way its supposed to with config-loader
const pgUrl = process.env.POSTGRES_SERVICE_HOST ?

    // kubernetes URI
    'postgres://routyfruity:superduperroutes1337bro@' + process.env.POSTGRES_SERVICE_HOST + ':' + process.env.POSTGRES_SERVICE_PORT_POSTGRES + '/fruits' :

    // docker-compose (local) URI
    process.env.DB_PORT_5432_TCP_ADDR ?
    'postgres://' + process.env.DB_USER + ':superduperroutes1337bro@' + process.env.DB_PORT_5432_TCP_ADDR + '/' + process.env.DB_NAME :

    // local URI
    'postgres://postgres@localhost/routes-dev';

module.exports = {
    DB: str({
        desc: 'Database connection',
        default: pgUrl,
    }),
};
