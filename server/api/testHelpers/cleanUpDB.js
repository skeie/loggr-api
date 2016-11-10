const { db } = require('../../../libs/db-handler').initialize();

function cleanUpDb() {
   return db.tx((t) => {
       // `t` and `this` here are the same;
       // this.ctx = transaction config + state context;
       return t.batch([
           t.result('DELETE FROM bucket_route'),
           t.result('DELETE FROM buckets'),
           t.result('DELETE FROM vertice_photos'),
           t.result('DELETE FROM vertices'),
           t.result('DELETE FROM route_admin'),
           t.result('DELETE FROM routes'),
           
           // more stuff
       ]);
   })
   .then((data) => {
       console.log('DB cleaned up', data.map(d => d.rowCount));
       return data;
   })
   .catch((error) => {
       console.log('Failed to cleanup DB:', error.message || error);
       throw error;
   });
}


module.exports = cleanUpDb;