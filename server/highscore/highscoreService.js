class Service {
    constructor(dao, commonDao) {
        const HighscoreDao = dao || require('./highscoreDao');
        const CommonDao = commonDao || require('../common/dao');
        this.dao = new HighscoreDao();
        this.commonDao = new CommonDao();
    }

    update = (userId, amount) => {
        return this.dao.update(userId, amount);
    };

    getAll = async userId => {
        const [highscore, userHighScore] = await Promise.all([
            this.dao.getAll(),
            this.dao.get(userId),
        ]);
        return { highscore, userHighScore };
    };

    create = (userId, isOldUser) => {
        // generate highscore based on exercises
        return this.dao.create(userId, 0);
    };
}

module.exports = Service;
