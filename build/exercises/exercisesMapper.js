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
  return array.map(function (element) {
    return {
      id: element[0].id,
      metaData: "",
      name: element[0].name,
      sets: element
    };
  });
};

var exerciseMapper = exports.exerciseMapper = function exerciseMapper(exercise) {
  var returnExercise = {};
  exercise.map(function (element) {
    returnExercise.id = element.id;
    returnExercise.name = element.name;
    returnExercise.metaData = element.body;
  });
  returnExercise.sets = exercise;
  return returnExercise;
};
//# sourceMappingURL=exercisesMapper.js.map