"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exerciseMapper = exports.exercisesMapper = undefined;

var _lodash = require("lodash");

var exercisesMapper = exports.exercisesMapper = function exercisesMapper(exercises) {
  var grouped = (0, _lodash.groupBy)(exercises, function (exercise) {
    return exercise.exercise_id;
  });
  var array = Object.keys(grouped).map(function (key) {
    return grouped[key];
  });
  var sorted = array.sort(function (a, b) {
    return new Date(b[0].updated) - new Date(a[0].updated);
  });

  return sorted.map(function (element) {
    return {
      id: element[0].exercise_id,
      metaData: "",
      name: element[0].name,
      sets: element
    };
  });
};

var exerciseMapper = exports.exerciseMapper = function exerciseMapper(exercise) {

  var returnExercise = {
    id: exercise[0].exerciseId,
    name: exercise[0].name,
    metaData: exercise[0].body
  };

  returnExercise.sets = exercise.sort(function (a, b) {
    return a.index > b.index;
  });
  return returnExercise;
};
//# sourceMappingURL=exercisesMapper.js.map