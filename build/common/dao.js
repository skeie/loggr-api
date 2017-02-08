'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var snakeCase = require('lodash/snakeCase');

var Dao = function Dao(db) {
  var _this = this;

  _classCallCheck(this, Dao);

  this.update = function (id, object, table) {

    var args = [];
    var keys = Object.keys(object);

    if (!keys.length) {
      return Promise.resolve(object);
    }
    var query = 'UPDATE ' + table + ' SET ';
    var count = 1;

    keys.forEach(function (key) {
      query += snakeCase(key) + '=$' + count + ', ';
      args.push(object[key]);
      count++;
    });

    args.push(id);

    query += 'updated=now() WHERE id=$' + count + ' returning id;';
    console.log('query: ', query, args);

    return _this.insert(query, args);
  };

  this.insert = function (query, data) {
    return new Promise(function (resolve, reject) {
      _this.db.one(query, data).then(function (data) {
        resolve(data);
      }).catch(function (error) {
        console.log('error', error);
        reject(error);
      });
    });
  };

  this.db = db || require('../lib/dbConnection').db;
};

module.exports = Dao;
//# sourceMappingURL=dao.js.map