"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exerciseMapper = exports.exercisesMapper = undefined;

var _groupBy = require("lodash/groupBy");

var _groupBy2 = _interopRequireDefault(_groupBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exercisesMapper = exports.exercisesMapper = function exercisesMapper(exercises) {
  var workoutExercises = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var grouped = (0, _groupBy2.default)(exercises, function (exercise) {
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
      sets: element,
      isInWorkout: workoutExercises.some(function (workoutExercise) {
        return workoutExercise.id === element[0].exercise_id;
      })
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