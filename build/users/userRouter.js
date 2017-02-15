"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _userService = require("./userService");

var _userService2 = _interopRequireDefault(_userService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


var service = new _userService2.default();

var createUser = function createUser(req, res, next) {

  service.createUser(req.body).then(function (user) {
    res.json(user);
  }).catch(function (error) {
    console.log("error", error);

    res.sendStatus(400);
  });
};

router.post("/", createUser);

var validate = function validate(param, req) {
  var errors = req.validationErrors();

  if (errors) {
    console.log({ what: param, error: JSON.stringify(errors) });
    return _extends({}, errors);
  } else {
    return {};
  }
};

module.exports = router;
//# sourceMappingURL=userRouter.js.map