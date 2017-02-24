"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jwtToken = require("../util/jwtToken");

var Service = function Service(dao, commonDao) {
  var _this = this;

  _classCallCheck(this, Service);

  this.createUser = function (user) {
    return _this.dao.getUser(user.email).then(function (ourUser) {
      if (Boolean(ourUser)) {
        _this.highscoreService.create(ourUser.id, true); //legazy, remove me
        return _extends({}, ourUser, { jwtToken: jwtToken.generateToken(ourUser) });
      } else {
        return _this.dao.createUser(user).then(function (id) {
          _this.highscoreService.create(id);
          return _extends({}, user, {
            id: id,
            jwtToken: jwtToken.generateToken(_extends({}, user, { id: id }))
          });
        });
      }
    });
  };

  var userDAO = dao || require("./userDAO");
  var CommonDao = commonDao || require("../common/dao");
  var HighscoreService = require("../highscore/highscoreService");
  this.highscoreService = new HighscoreService();
  this.dao = new userDAO();
  this.commonDao = new CommonDao();
};

exports.default = Service;
//# sourceMappingURL=userService.js.map