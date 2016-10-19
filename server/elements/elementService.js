export default class Service {

  constructor(dao) {
    const ElementDao = dao || require('./elementDao');
    this.dao = new ElementDao();
  }

  postElement = element => {
    return this.dao.postElement(element);
  }

  update = (id, object, table) => {
    return this.dao.update(id, object, table);
  }
}
