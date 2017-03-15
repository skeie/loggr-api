"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jwtToken = require("../util/jwtToken");

var Service = function Service(dao, commonDao) {
  var _this = this;

  _classCallCheck(this, Service);

  this.createWorkout = function (exerciseId, userId) {
    return _this.dao.createWorkout(exerciseId, userId);
  };

  this.updateCurrentWorkout = function (exerciseId, userId) {
    return _this.dao.updateCurrentWorkout(exerciseId, userId);
  };

  this.getCurrentWorkout = function (userId) {
    return _this.dao.getCurrentWorkout(userId).then(function (exercises) {
      return _this.exerciseDao.getWorkoutExercise(exercises);
    }).catch(function (error) {
      return error;
    });
  };

  this.deleteExerciseInWorkout = function (exerciseId) {
    return _this.dao.deleteExerciseInWorkout(exerciseId);
  };

  var workoutDao = dao || require("./workoutDao");
  var CommonDao = commonDao || require("../common/dao");
  var ExerciseDao = require("../exercises/exercisesDao");
  this.dao = new workoutDao();
  this.commonDao = new CommonDao();
  this.exerciseDao = new ExerciseDao();
};

exports.default = Service;
//# sourceMappingURL=workoutService.js.map