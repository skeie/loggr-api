class Dao {
    constructor(db, dao) {
        this.db = db || require('../lib/dbConnection').db;
        const CommonDao = dao || require('../common/dao');
        this.commonDao = new CommonDao();
    }

    getUserPushToken = userId => {
        return this.db
            .one(`select push_token as "pushToken" from users where id = $1`, [
                userId,
            ])
            .catch(err => console.log('err sap', err));
    };
    getUserWithEmail = email => {
        return this.db
            .any(
                `select id, name, weekly_training as "weeklyTraining",  image, email from users where email=$1`,
                [email],
            )
            .then(function(data) {
                return data[0]; //assume there is only one
            })
            .catch(function(error) {
                console.log('no user found', error);
                return false;
            });
    };

    incrementStreak = userId => {
        return this.db.none(
            'update users set streak = streak + 1 where id = $1',
            [userId],
        );
    };
    setStreakToNull = userId => {
        return this.db.none('update users set streak = 0 where id = $1', [
            userId,
        ]);
    };
    getUserById = userId => {
        return this.db
            .one(
                `select usr.id, name, weekly_training as "weeklyTraining", streak,  image, email, s.highscore from users usr left join highscore s on (s.user_id = $1) where usr.id = $1`,
                [userId],
            )
            .catch(err => console.log('err', err));
    };

    createUser = user => {
        return this.db
            .one(
                'insert into users(name, image, email, push_token, weekly_training) values($1, $2, $3, $4, $5) returning id',
                [
                    user.name,
                    user.image,
                    user.email,
                    user.pushToken,
                    user.weeklyTraining,
                ],
            )
            .then(function({ id }) {
                return id;
            })
            .catch(function(error) {
                console.log('ERROR in createUser:', error.message || error); // print error;
            });
    };

    getAllUsers = () =>
        this.db.any('select * from users').catch(err => {
            console.log('err in getAllUsers', err);
        });
}

module.exports = Dao;
