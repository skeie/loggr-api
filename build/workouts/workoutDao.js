"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dao = function Dao(db, dao) {
  var _this = this;

  _classCallCheck(this, Dao);

  this.createWorkout = function (exerciseId, userId) {
    console.log('sapdap1', typeof exerciseId === "undefined" ? "undefined" : _typeof(exerciseId), typeof userId === "undefined" ? "undefined" : _typeof(userId));
    return _this.db.one("INSERT INTO workouts (exercises, users) VALUES (ARRAY[ $1 ], ARRAY [ $2 ]) returning id", [exerciseId, userId]);
  };

  this.updateCurrentWorkout = function (exerciseId, userId) {
    console.log('sapdap', exerciseId, userId);
    return _this.db.one("update workouts set exercises = array_append(exercises, $1) where is_active = true and $2 = ANY(users) returning id", [exerciseId, userId]).then(function (_ref) {
      var id = _ref.id;

      return id;
    }).catch(function (error) {
      console.log("ERROR:", error.message || error); // print error;
    });
  };

  this.deleteExerciseInWorkout = function (exerciseId) {
    return _this.db.any("update workouts set exercises = array_remove(exercises, $1) where is_active = true", [exerciseId]);
  };

  this.getCurrentWorkout = function (userId) {
    return _this.db.any("SELECT distinct e.name, e.id, e.body FROM exercises e JOIN workouts w \n        on e.id = ANY (w.exercises)\n        where w.is_active = true and $1 = ANY (w.users) ", [userId]);
  };

  this.db = db || require("../lib/dbConnection").db;
  var CommonDao = dao || require("../common/dao");
  this.commonDao = new CommonDao();
};

module.exports = Dao;
//# sourceMappingURL=workoutDao.js.map