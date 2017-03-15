export const convertExerciseIdToInt = (req, res, next) => {
  req.params.exerciseId = parseInt(req.params.exerciseId, 10);
  next();
};
