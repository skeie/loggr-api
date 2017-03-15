"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _workoutService = require("./workoutService");

var _workoutService2 = _interopRequireDefault(_workoutService);

var _jwtToken = require("../util/jwtToken");

var _isEmpty = require("lodash/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _util = require("../util/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var requireToken = (0, _jwtToken.requireAuth)();
var service = new _workoutService2.default();


var createWorkout = function createWorkout(req, res, next) {
  var errors = validate("exerciseid", req);
  if (!(0, _isEmpty2.default)(errors)) {
    res.send(400, errors);
  }
  service.createWorkout(req.params.exerciseId, req.user.id).then(function (user) {
    res.sendStatus(201);
  }).catch(function (error) {
    console.log("error", error);
    res.sendStatus(400);
  });
};

var getCurrentWorkout = function getCurrentWorkout(req, res, next) {
  var errors = validate("user", req);
  if (!(0, _isEmpty2.default)(errors)) {
    res.send(400, errors);
  }
  service.getCurrentWorkout(req.user.id).then(function (workout) {
    res.json(workout || {});
  }).catch(function (error) {
    console.log("error", error);
    res.sendStatus(400);
  });
};

var updateCurrentWorkout = function updateCurrentWorkout(req, res, next) {
  var errors = validate("exerciseId", req);
  if (!(0, _isEmpty2.default)(errors)) {
    res.send(400, errors);
  }

  service.updateCurrentWorkout(req.params.exerciseId, req.user.id).then(function (user) {
    res.json(user);
  }).catch(function (error) {
    console.log("error", error);

    res.sendStatus(400);
  });
};

var deleteExerciseInWorkout = function deleteExerciseInWorkout(req, res, next) {
  var errors = validate("exerciseId", req);
  if (!(0, _isEmpty2.default)(errors)) {
    res.send(400, errors);
  }

  service.deleteExerciseInWorkout(req.params.exerciseId).then(function () {
    res.sendStatus(204);
  }).catch(function (error) {
    console.log("error", error);

    res.sendStatus(400);
  });
};

router.post("/:exerciseId", requireToken, _util.convertExerciseIdToInt, createWorkout);
router.get("/", requireToken, getCurrentWorkout);
router.put("/:exerciseId", requireToken, _util.convertExerciseIdToInt, updateCurrentWorkout);
router.delete("/:exerciseId", requireToken, _util.convertExerciseIdToInt, deleteExerciseInWorkout);

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
//# sourceMappingURL=workoutRouter.js.map