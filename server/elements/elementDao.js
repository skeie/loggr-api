class Dao {
  constructor(dao) {
    const CommonDao = dao || require('../common/dao');
    this.commonDao = new CommonDao();
  }

  postElement = (amount, index, exerciseId) => {
    const data = {amount, index, exerciseId};
    const query = 'INSERT INTO elements(amount, index, exercise_id) VALUES(${amount}, ${index}, ${exerciseId})';
    return this.commonDao.insert(query, data);
  }

  update = (id, object, table) => {
    return this.commonDao.update(id, object, table);
  }

}

module.exports = Dao;

