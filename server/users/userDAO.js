class Dao {
  constructor(db, dao) {
    this.db = db || require("../lib/dbConnection").db;
    const CommonDao = dao || require("../common/dao");
    this.commonDao = new CommonDao();
  }

  getUser = email => {
    return this.db.any("select id, name, image, email from users where email=$1", [email])
    .then(function (data) {
        return data[0]; //assume there is only one
    })
    .catch(function (error) {
       return false; 
    });
  }

  createUser = user => {
    return this.db
      .one("insert into users(name, image, email) values($1, $2, $3) returning id", [
        user.name,
        user.url,
        user.email
      ])
      .then(function({id}) {
        return id;
        
      })
      .catch(function(error) {
        console.log("ERROR:", error.message || error); // print error;
      });
  };
}

module.exports = Dao;
