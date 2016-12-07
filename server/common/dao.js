import {snakeCase} from 'lodash';

class Dao {
  constructor(db) {
    this.db = db || require('../lib/dbConnection').db;
  }

  update = (id, object, table) => {
    
    let args = [];
    let keys = Object.keys(object);

    if (!keys.length) {
      return Promise.resolve(object);
    }
    let query = `UPDATE ${table} SET `;
    let count = 1;

    keys.forEach(key => {
      query += `${snakeCase(key)}=$${count}, `;
      args.push(object[key]);
      count++;
    });

    args.push(id);

    query += `updated=now() WHERE id=$${count} returning id;`;
    console.log('query: ', query, args);
    
    return this.insert(query, args);
  }

  insert = (query, data) => {
    return new Promise((resolve, reject) => {
      this.db.one(query, data)
                .then(data => {
                  resolve(data);
                })
                .catch(error => {
                  console.log('error', error);
                  reject(error);
                });
    });
  }

}

module.exports = Dao;

