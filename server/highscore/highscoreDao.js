class Dao {
    constructor(db, dao) {
        this.db = db || require('../lib/dbConnection').db;
        const CommonDao = dao || require('../common/dao');
        this.commonDao = new CommonDao();
    }

    getAll = () => {
        return this.db
            .query(
                `select user_id as userId, highscore, name, image from highscore inner join users s on s.id = user_id  order by highscore desc limit 5;`,
            )
            .then(data => data)
            .catch(error => {
                console.log(error);
                return error;
            });
    };

    update = (userId, value) => {
        return this.db
            .one(
                'update highscore set highscore = highscore + $2 where user_id = $1 returning id',
                [userId, value],
            )
            .then(function({ id }) {
                return id;
            })
            .catch(function(error) {
                console.log(
                    'ERROR in update highscore:',
                    error.message || error,
                ); // print error;
            });
    };

    getHighScoreBasedOnGuild = userIds =>
        this.db
            .any(
                `select user_id as userId, highscore, name, image from highscore inner join users s on s.id = user_id where s.id = ANY ($1) order by highscore desc`,
                [userIds],
            )
            .catch(err =>
                console.log('error in getHighScoreBasedOnGuild', err),
            );

    get = userId => {
        return this.db
            .one(
                `
      WITH summary AS (
        SELECT h.*,
          ROW_NUMBER() OVER(ORDER BY highscore DESC) AS position FROM highscore h)
        SELECT  highscore, position FROM summary s
        WHERE s.user_id = ${userId}`,
            )
            .catch(error => {
                console.log('error in get highscore', error, userId);
                return error;
            });
    };

    create = userId => {
        return this.db
            .one(
                'insert into highscore(user_id, highscore) values($1, $2) returning id',
                [userId, 0],
            )
            .then(function({ id }) {
                return id;
            })
            .catch(function(error) {
                console.log(
                    'ERROR in create highscore :',
                    error.message || error,
                ); // print error;
            });
    };
}

module.exports = Dao;
