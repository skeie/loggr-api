'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _elementService = require('./elementService');

var _elementService2 = _interopRequireDefault(_elementService);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var service = new _elementService2.default();


var postElement = function postElement(req, res, next) {
  var errors = validate('element', req);
  if (!(0, _lodash.isEmpty)(errors)) {
    res.send(400, errors);
  }

  service.postElement(req.body.element, req.params.exerciseId).then(function () {
    res.sendStatus(201);
  }).catch(function () {
    res.sendStatus(400);
  });
};

var updateElement = function updateElement(req, res, next) {
  var errors = validate('element', req);
  if (!(0, _lodash.isEmpty)(errors)) {
    res.send(400, errors);
  }

  var table = 'elements';

  service.update(req.params.id, req.body.element, table).then(function () {
    res.sendStatus(201);
  }).catch(function () {
    res.sendStatus(400);
  });
};

router.put('/:id', updateElement);
router.post('/:exerciseId/element', postElement);

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
//# sourceMappingURL=elementRouter.js.map