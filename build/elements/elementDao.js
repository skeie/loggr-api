'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dao = function Dao(dao) {
  var _this = this;

  _classCallCheck(this, Dao);

  this.postElement = function (amount, index, exerciseId) {
    var data = { amount: amount, index: index, exerciseId: exerciseId };
    var query = 'INSERT INTO elements(amount, index, exercise_id) VALUES(${amount}, ${index}, ${exerciseId})';
    return _this.commonDao.insert(query, data);
  };

  this.update = function (id, object, table) {
    return _this.commonDao.update(id, object, table);
  };

  var CommonDao = dao || require('../common/dao');
  this.commonDao = new CommonDao();
};

module.exports = Dao;
//# sourceMappingURL=elementDao.js.map