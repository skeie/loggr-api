'use strict';

var pgp = require('pg-promise')();
var cn = {
  host: 'localhost',
  port: 5432,
  database: 'loggr'
};
var url = process.env.DATABASE_URL || 'localhost';
var db = pgp(url);

function pingPostgres() {
  // ping service
  db.query('SELECT \'DBD::Pg ping test\'').then(function () {
    console.log('Postgres is running!');
  }).catch(function (err) {
    console.log('Failed to connect to postgres ', err);
    throw err;
  });
}

module.exports = {
  pingPostgres: pingPostgres,
  db: db
};
//# sourceMappingURL=dbConnection.js.map