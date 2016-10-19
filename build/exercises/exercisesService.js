'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = function Service(dao) {
  var _this = this;

  _classCallCheck(this, Service);

  this.getOne = function (id) {
    return _this.dao.getOne(id);
  };

  this.getAll = function () {
    return _this.dao.getAll();
  };

  this.postOne = function (exercise, userId) {
    return _this.dao.postOne(exercise, userId);
  };

  this.postElement = function (element) {
    return _this.dao.postElement(element);
  };

  this.update = function (id, object, table) {
    return _this.dao.update(id, object, table);
  };

  this.delete = function (id, table) {
    return _this.dao.delete(id, table);
  };

  var ExercisesDao = dao || require('./exercisesDao');
  this.dao = new ExercisesDao();
};

exports.default = Service;
//# sourceMappingURL=exercisesService.js.map