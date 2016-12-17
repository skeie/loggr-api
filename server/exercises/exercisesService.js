export default class Service {

  constructor(dao, commonDao) {
    const ExercisesDao = dao || require('./exercisesDao');
    const CommonDao = commonDao || require('../common/dao');
    this.dao = new ExercisesDao();
    this.commonDao = new CommonDao();
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
    return this.commonDao.update(id, object, table)
    .then(({ id }) => this.getOne(id));
  }
  delete = (id, table) => {
    return this.dao.delete(id, table);
  }

}
