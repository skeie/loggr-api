class Dao {
  constructor(db, dao) {
    this.db = db || require("../lib/dbConnection").db;
    const CommonDao = dao || require("../common/dao");
    this.commonDao = new CommonDao();
  }

  get = userId => {
    return this.db
      .query(
        `
      SELECT index from highscore where user_id = ${userId}`
        // need to order by elements.id to have the right sequence in grid
      )
      .then(data => data)
      .catch(error => {
        return error;
      });
  };

  create = (userId, highscore) => {
    console.log(highscore)
    return this.db
      .one("insert into highscore(user_id, highscore) values($1, $2) returning id", [userId, highscore])
      .then(function({ id }) {
        return id;
      })
      .catch(function(error) {
        console.log("ERROR:", error.message || error); // print error;
      });
  };
}

module.exports = Dao;
