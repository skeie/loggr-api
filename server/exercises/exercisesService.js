export default class Service {

  constructor(dao, commonDao) {
    const ExercisesDao = dao || require('./exercisesDao');
    const CommonDao = commonDao || require('../common/dao');
    const WorkoutDao = require('../workouts/workoutDao');
    this.dao = new ExercisesDao();
    this.commonDao = new CommonDao();
    this.workoutDao = new WorkoutDao();
  }

  getOne = id => {
    return this.dao.getOne(id);
  }

  getAll = (userId) => {
    return this.workoutDao.getCurrentWorkout(userId)
    .then(currentWorkout => this.dao.getAll(userId, currentWorkout))
    
  }

  postOne = (exercise, userId) => {
    return this.dao.postOne(exercise, userId);
  }

  postElement = element => {
    return this.dao.postElement(element);
  }

  update = (id, object, table) => {
    return this.commonDao.update(id, object, table)
    .then(({ id }) => this.getOne(id));
  }
  delete = (id, table) => {
    return this.dao.delete(id, table);
  }

}
