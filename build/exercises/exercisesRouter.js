'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _exercisesService = require('./exercisesService');

var _exercisesService2 = _interopRequireDefault(_exercisesService);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var service = new _exercisesService2.default();

var findOne = function findOne(req, res, next) {
  service.getOne(req.params.id).then(function (data) {
    res.json({ data: data });
  });
};

var postOne = function postOne(req, res, next) {
  var errors = validate('exercise', req);
  if (!(0, _lodash.isEmpty)(errors)) {
    res.send(400, errors);
  }

  service.postOne(req.body.exercise, req.params.userId).then(function (newExercise) {
    res.json(newExercise);
  }).catch(function () {
    res.sendStatus(400);
  });
};

var updateExercise = function updateExercise(req, res, next) {
  var errors = validate('exercise', req);
  if (!(0, _lodash.isEmpty)(errors)) {
    res.send(400, errors);
  }

  var table = 'exercises';
  service.update(req.params.id, req.body.exercise, table).then(function () {
    res.sendStatus(201);
  }).catch(function () {
    res.sendStatus(400);
  });
};

var deleteExercise = function deleteExercise(req, res, next) {
  var table = 'exercises';
  service.delete(req.params.id, table).then(function () {
    res.sendStatus(200);
  }).catch(function (error) {
    console.log('error', error);

    res.sendStatus(400);
  });
};

var getAll = function getAll(req, res, next) {
  service.getAll().then(function (data) {
    debugger;

    res.json({ data: data });
  }).catch(function (error) {
    res.sendStatus(400);
  });
};

router.put('/:id/:index', updateExercise);
router.delete('/:id', deleteExercise);
router.get('/:id', findOne);
router.get('/', getAll);
router.post('/:userId', postOne);

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
//# sourceMappingURL=exercisesRouter.js.map