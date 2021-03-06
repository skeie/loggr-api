class Dao {
    constructor(db, dao) {
        this.db = db || require('../lib/dbConnection').db;
        const CommonDao = dao || require('../common/dao');
        this.commonDao = new CommonDao();
    }

    getAll = () => {
        return this.db
            .query(
                `select user_id as userId, highscore, name from highscore inner join users s on s.id = user_id  order by highscore desc limit 5;`
            )
            .then(data => data)
            .catch(error => {
                console.log(error);
                return error;
            });
    };

    get = userId => {
        return this.db
            .query(
                `
      WITH summary AS (
        SELECT h.*,
          ROW_NUMBER() OVER(ORDER BY highscore DESC) AS position FROM highscore h)
        SELECT position FROM summary s
        WHERE s.user_id = ${userId}`
            )
            .then(data => {
                return data;
            })
            .catch(error => {
                return error;
            });
    };

    create = (userId, highscore) => {
        return this.db
            .one(
                'insert into highscore(user_id, highscore) values($1, $2) returning id',
                [userId, highscore]
            )
            .then(function({ id }) {
                return id;
            })
            .catch(function(error) {
                console.log('ERROR:', error.message || error); // print error;
            });
    };
}

module.exports = Dao;
