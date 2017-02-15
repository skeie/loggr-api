"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dao = function Dao(db, dao) {
  var _this = this;

  _classCallCheck(this, Dao);

  this.getUser = function (email) {
    return _this.db.any("select id, name, image, email from users where email=$1", [email]).then(function (data) {
      return data[0]; //assume there is only one
    }).catch(function (error) {
      return false;
    });
  };

  this.createUser = function (user) {
    return _this.db.one("insert into users(name, image, email) values($1, $2, $3) returning id", [user.name, user.url, user.email]).then(function (_ref) {
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
//# sourceMappingURL=userDAO.js.map