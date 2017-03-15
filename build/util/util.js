"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var convertExerciseIdToInt = exports.convertExerciseIdToInt = function convertExerciseIdToInt(req, res, next) {
  req.params.exerciseId = parseInt(req.params.exerciseId, 10);
  next();
};
//# sourceMappingURL=util.js.map