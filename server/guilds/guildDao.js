class Dao {
    constructor(db, dao) {
        this.db = db || require('../lib/dbConnection').db;
        const CommonDao = dao || require('../common/dao');
        this.commonDao = new CommonDao();
    }

    findGuildBasedOnUserid = id => {
        return this.db
            .any(`SELECT name, users FROM guilds where $1 = ANY (users)`, [id])
            .then(result => result[0])
            .catch(error => {
                console.log('error in postingImageUrl', error);
                return error;
            });
    };

    addUserToGuild = (userId, guildId) => {
        return this.db
            .none(
                'update guilds set users = array_append(users, $2) where id = $1',
                [guildId, userId],
            )
            .catch(error => {
                console.log('error in addUserToGuild', error);
            });
    };
}

module.exports = Dao;

// return this.db.any(
//   `SELECT distinct e.name, e.id, e.body FROM exercises e JOIN workouts w
//     on e.id = ANY (w.exercises)
//     where w.is_active = true and $1 = ANY (w.users) `,
//   [userId]