"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _highscoreService = require("./highscoreService");

var _highscoreService2 = _interopRequireDefault(_highscoreService);

var _jwtToken = require("../util/jwtToken");

var _isEmpty = require("lodash/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var service = new _highscoreService2.default();

var requireToken = (0, _jwtToken.requireAuth)();


var getAll = function getAll(req, res, next) {
  var errors = validate("user", req);
  if (!(0, _isEmpty2.default)(errors)) {
    res.send(400, errors);
  }

  service.getAll(req.user.id).then(function (data) {
    res.json(data);
  }).catch(function () {
    res.sendStatus(400);
  });
};

router.get("/", requireToken, getAll);

function validate(param, req) {
  var errors = req.validationErrors();

  if (errors) {
    console.log({ what: param, error: JSON.stringify(errors) });
    return _extends({}, errors);
  } else {
    return {};
  }
}

module.exports = router;
//# sourceMappingURL=highscoreRouter.js.map