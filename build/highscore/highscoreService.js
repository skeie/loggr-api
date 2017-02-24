"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = function Service(dao, commonDao) {
  var _this = this;

  _classCallCheck(this, Service);

  this.update = function (userId, amount) {
    return _this.dao.getOne(id);
  };

  this.get = function (userId) {
    return _this.dao.getAll(userId);
  };

  this.create = function (userId, isOldUser) {
    // generate highscore based on exercises
    var highscore = 0;
    if (isOldUser) {
      return _this.exerciseDao.getAll(userId).then(function (allExercise) {
        highscore = allExercise.reduce(function (prevItem, exercise) {
          return prevItem + exercise.sets.reduce(function (prevItem, set) {
            if (Boolean(set.amount)) {
              return prevItem + parseInt(set.amount.replace(/\D+/g, ""));
            } else {
              return prevItem;
            }
          }, 0);
        }, 0);
        return _this.dao.create(userId, highscore);
      });
    } else {
      return _this.dao.create(userId, highscore);
    }
  };

  var HighscoreDao = dao || require("./highscoreDao");
  var CommonDao = commonDao || require("../common/dao");
  var ExerciseDao = require("../exercises/exercisesDao");
  this.exerciseDao = new ExerciseDao();
  this.dao = new HighscoreDao();
  this.commonDao = new CommonDao();
};

module.exports = Service;
//# sourceMappingURL=highscoreService.js.map