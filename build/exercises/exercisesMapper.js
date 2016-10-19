"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var exercisesMapper = exports.exercisesMapper = function exercisesMapper(exercises) {

  var newExercise = [];
  exercises.forEach(function (exercise) {
    var user_id = exercise.user_id;
    var created = exercise.created;

    var rest = _objectWithoutProperties(exercise, ["user_id", "created"]);

    var current = newExercise[rest.id] || {};

    current.sets = current.sets || [];
    current.id = rest.id;
    current.metaData = rest.body;

    current.name = rest.name;
    current.sets[rest.index] = rest.amount || 0;
    newExercise[rest.id] = current;
  });
  return newExercise.filter(function (element) {
    return element;
  });
};

var exerciseMapper = exports.exerciseMapper = function exerciseMapper(exercise) {
  var sets = [];
  var returnExercise = {};
  exercise.forEach(function (element) {
    returnExercise.id = element.id;
    returnExercise.name = element.name;
    returnExercise.metaData = element.body;
    sets[element.index] = element.amount;
  });
  returnExercise.sets = sets;
  return returnExercise;
};
//# sourceMappingURL=exercisesMapper.js.map