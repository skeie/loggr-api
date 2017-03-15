'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = function Service(dao, commonDao) {
  var _this = this;

  _classCallCheck(this, Service);

  this.getOne = function (id) {
    return _this.dao.getOne(id);
  };

  this.getAll = function (userId) {
    return _this.workoutDao.getCurrentWorkout(userId).then(function (currentWorkout) {
      return _this.dao.getAll(userId, currentWorkout);
    });
  };

  this.postOne = function (exercise, userId) {
    return _this.dao.postOne(exercise, userId);
  };

  this.postElement = function (element) {
    return _this.dao.postElement(element);
  };

  this.update = function (id, object, table) {
    return _this.commonDao.update(id, object, table).then(function (_ref) {
      var id = _ref.id;
      return _this.getOne(id);
    });
  };

  this.delete = function (id, table) {
    return _this.dao.delete(id, table);
  };

  var ExercisesDao = dao || require('./exercisesDao');
  var CommonDao = commonDao || require('../common/dao');
  var WorkoutDao = require('../workouts/workoutDao');
  this.dao = new ExercisesDao();
  this.commonDao = new CommonDao();
  this.workoutDao = new WorkoutDao();
};

exports.default = Service;
//# sourceMappingURL=exercisesService.js.map