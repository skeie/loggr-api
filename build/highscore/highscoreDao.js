"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dao = function Dao(db, dao) {
  var _this = this;

  _classCallCheck(this, Dao);

  this.get = function (userId) {
    return _this.db.query("\n      SELECT index from highscore where user_id = " + userId
    // need to order by elements.id to have the right sequence in grid
    ).then(function (data) {
      return data;
    }).catch(function (error) {
      return error;
    });
  };

  this.create = function (userId, highscore) {
    console.log(highscore);
    return _this.db.one("insert into highscore(user_id, highscore) values($1, $2) returning id", [userId, highscore]).then(function (_ref) {
      var id = _ref.id;

      return id;
    }).catch(function (error) {
      console.log("ERROR:", error.message || error); // print error;
    });
  };

  this.db = db || require("../lib/dbConnection").db;
  var CommonDao = dao || require("../common/dao");
  this.commonDao = new CommonDao();
};

module.exports = Dao;
//# sourceMappingURL=highscoreDao.js.map