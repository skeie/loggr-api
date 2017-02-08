"use strict";

var _exercisesMapper = require("./exercisesMapper");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dao = function Dao(db, dao) {
  var _this = this;

  _classCallCheck(this, Dao);

  this.getAll = function (userId) {
    return _this.db.query("\n      SELECT DISTINCT (elements.exercise_id), elements.id, name, body, index, amount, exercises.updated\n      FROM exercises, elements\n      WHERE elements.exercise_id = exercises.id AND user_id = " + userId + " order by elements.id"
    // need to order by elements.id to have the right sequence in grid
    ).then(function (data) {
      return (0, _exercisesMapper.exercisesMapper)(data);
    }).catch(function (error) {
      return error;
    });
  };

  this.getOne = function (id) {
    return _this.db.query("select exercises.id as \"exerciseId\", elements.id, name, body, index, amount from exercises, elements where exercises.id = " + id + " AND elements.exercise_id = exercises.id order by index").then(function (data) {
      return (0, _exercisesMapper.exerciseMapper)(data);
    }).catch(function (error) {
      return error;
    });
  };

  this.postOne = function (exercise, userId) {
    return new Promise(function (resolve, reject) {
      var newExercise = Object.assign({}, exercise);
      newExercise.userId = userId;
      var query = "INSERT INTO exercises(name, body, user_id) VALUES(${name}, ${body}, ${userId}) returning id";
      return _this.commonDao.insert(query, newExercise).then(function (data) {
        var id = data.id;

        _this.postThreeElements(id).then(function () {
          _this.getOne(id).then(function (newExercise) {
            return resolve(newExercise);
          });
        });
      });
    });
  };

  this.postThreeElements = function (exerciseId) {
    var query = "INSERT INTO elements (index, amount, exercise_id) values (${i}, 0, ${exerciseId}) returning id";
    return Promise.all([_this.commonDao.insert(query, { i: 0, exerciseId: exerciseId }), _this.commonDao.insert(query, { i: 1, exerciseId: exerciseId }), _this.commonDao.insert(query, { i: 2, exerciseId: exerciseId })]);
  };

  this.postElement = function (amount, index, exerciseId) {
    var data = { amount: amount, index: index, exerciseId: exerciseId };
    var query = "INSERT INTO elements(amount, index, exercise_id) VALUES(${amount}, ${index}, ${exerciseId})";
    return _this.commonDao(query, data);
  };

  this.delete = function (id, table) {
    return _this.db.none("DELETE FROM " + table + " where id = " + id);
  };

  this.db = db || require("../lib/dbConnection").db;
  var CommonDao = dao || require("../common/dao");
  this.commonDao = new CommonDao();
};

module.exports = Dao;
//# sourceMappingURL=exercisesDao.js.map