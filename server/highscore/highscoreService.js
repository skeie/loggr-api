class Service {
    constructor(dao, commonDao) {
        const HighscoreDao = dao || require('./highscoreDao');
        const CommonDao = commonDao || require('../common/dao');
        const ExerciseDao = require('../exercises/exercisesDao');
        this.exerciseDao = new ExerciseDao();
        this.dao = new HighscoreDao();
        this.commonDao = new CommonDao();
    }

    update = (userId, amount) => {
        return this.dao.getOne(id);
    };

    getAll = userId => {
        return Promise.all([this.dao.getAll(), this.dao.get(userId)])
            .then(([highscore, userHighScore]) => 
                Promise.resolve({ highscore, userHighScore }));
    };

    create = (userId, isOldUser) => {
        // generate highscore based on exercises
        return this.dao.create(userId, 0);
    };
}

module.exports = Service;
