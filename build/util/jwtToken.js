"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.secret = undefined;
exports.generateToken = generateToken;
exports.requireAuth = requireAuth;
exports.hasUserAuth = hasUserAuth;

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _expressJwt = require("express-jwt");

var _expressJwt2 = _interopRequireDefault(_expressJwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var secret = exports.secret = "qQDI9AO4LtMFC9NDMw9cM9PrFtEgkugW8Yie8R11LzzkNyjyLX1bmEKhoRoMKPm";

function generateToken(user) {
  // if (!opts.neveExpire) {
  //     tokenOpts.expiresIn = config.token.expires;
  // }

  return _jsonwebtoken2.default.sign(user, secret);
}

function requireAuth() {
  return (0, _expressJwt2.default)({
    secret: secret,
    credentialsRequired: true,
    getToken: _fromHeaderOrQuerystring
  });
}

function hasUserAuth(req, res, next) {
  var token = _fromHeaderOrQuerystring();
  var urlUserId = req.params.userId;
  var loggedInUserId = req.user ? req.user.id : 0;
  if (parseInt(urlUserId, 10) !== loggedInUserId) {
    next({
      message: "User is not authorized to perform this action",
      status: 401
    });
  } else {
    next();
  }
}

function _fromHeaderOrQuerystring(req, res) {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
}
//# sourceMappingURL=jwtToken.js.map