export default class Service {

  constructor(dao) {
    const ExercisesDao = dao || require('./exercisesDao');
    this.dao = new ExercisesDao();
  }

  getOne = id => {
    return this.dao.getOne(id);
  }

  getAll = () => {
    return this.dao.getAll();
  }

  postOne = (exercise, userId) => {
    return this.dao.postOne(exercise, userId);
  }

  postElement = element => {
    return this.dao.postElement(element);
  }

  update = (id, object, table) => {
    return this.dao.update(id, object, table);
  }
  delete = (id, table) => {
    return this.dao.delete(id, table);
  }

}
