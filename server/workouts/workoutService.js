const jwtToken = require("../util/jwtToken");

export default class Service {
  constructor(dao, commonDao) {
    const workoutDao = dao || require("./workoutDao");
    const CommonDao = commonDao || require("../common/dao");
    const ExerciseDao = require("../exercises/exercisesDao");
    this.dao = new workoutDao();
    this.commonDao = new CommonDao();
    this.exerciseDao = new ExerciseDao();
  }

  createWorkout = (exerciseId, userId) => {
    return this.dao.createWorkout(exerciseId, userId);
  };

  updateCurrentWorkout = (exerciseId, userId) => {
    return this.dao.updateCurrentWorkout(exerciseId, userId);
  };

  getCurrentWorkout = userId => {
    return this.dao
      .getCurrentWorkout(userId)
      .then(exercises => this.exerciseDao.getWorkoutExercise(exercises))
      .catch(error => error);
  };

  deleteExerciseInWorkout = exerciseId => {
    return this.dao.deleteExerciseInWorkout(exerciseId);
  };
}
