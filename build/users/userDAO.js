"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dao = function Dao(db, dao) {
  var _this = this;

  _classCallCheck(this, Dao);

  this.getUserWithEmail = function (email) {
    return _this.db.any("select id, name, image, email from users where email=$1", [email]).then(function (data) {
      return data[0]; //assume there is only one
    }).catch(function (error) {
      console.log("no user found", error);
      return false;
    });
  };

  this.getUserById = function (userId) {
    return _this.db.one("select usr.id, name, image, email, s.highscore from users usr left join highscore s on (s.user_id = $1) where usr.id = $1", [userId]).catch(function (err) {
      return console.log("err", err);
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