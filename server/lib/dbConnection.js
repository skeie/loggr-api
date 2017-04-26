const pgp = require('pg-promise')(/* options*/);
const cn = {
  host: 'localhost',
  port: 5432,
  database: 'zyada'
};
const url =  process.env.DATABASE_URL || cn;
var db = pgp(url);

function pingPostgres() {
    // ping service
  db.query(`SELECT 'DBD::Pg ping test'`)
    .then(() => {
      console.log('Postgres is running!');
    })
    .catch(err => {
      console.log('Failed to connect to postgres ', err);
      throw err;
    });
}

module.exports = {
  pingPostgres,
  db
};
