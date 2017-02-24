class Service {
  constructor(dao, commonDao) {
    const HighscoreDao = dao || require("./highscoreDao");
    const CommonDao = commonDao || require("../common/dao");
    const ExerciseDao = require("../exercises/exercisesDao");
    this.exerciseDao = new ExerciseDao();
    this.dao = new HighscoreDao();
    this.commonDao = new CommonDao();
  }

  update = (userId, amount) => {
    return this.dao.getOne(id);
  };

  get = userId => {
    return this.dao.getAll(userId);
  };

  create = (userId, isOldUser) => {
    // generate highscore based on exercises
    let highscore = 0;
    if (isOldUser) {
      return this.exerciseDao.getAll(userId).then(allExercise => {
        highscore = allExercise.reduce(
          (prevItem, exercise) => {
            return prevItem +
              exercise.sets.reduce(
                (prevItem, set) => {
                  if (Boolean(set.amount)) {
                    return prevItem + parseInt(set.amount.replace(/\D+/g, ""));
                  } else {
                    return prevItem;
                  }
                },
                0
              );
          },
          0
        );
        return this.dao.create(userId, highscore);
      });
    } else {
      return this.dao.create(userId, highscore);
    }
  };
}

module.exports = Service;
