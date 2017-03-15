class Dao {
  constructor(db, dao) {
    this.db = db || require("../lib/dbConnection").db;
    const CommonDao = dao || require("../common/dao");
    this.commonDao = new CommonDao();
  }

  createWorkout = (exerciseId, userId) => {
    console.log('sapdap1', typeof exerciseId, typeof userId)
    return this.db.one(
      `INSERT INTO workouts (exercises, users) VALUES (ARRAY[ $1 ], ARRAY [ $2 ]) returning id`,
      [exerciseId, userId]
    );
  };

  updateCurrentWorkout = (exerciseId, userId) => {
    console.log('sapdap', exerciseId, userId)
    return this.db
      .one(
        `update workouts set exercises = array_append(exercises, $1) where is_active = true and $2 = ANY(users) returning id`,
        [exerciseId, userId]
      )
      .then(function({ id }) {
        return id;
      })
      .catch(function(error) {
        console.log("ERROR:", error.message || error); // print error;
      });
  };

  deleteExerciseInWorkout = exerciseId => {
    return this.db.any(
      `update workouts set exercises = array_remove(exercises, $1) where is_active = true`,
      [exerciseId]
    );
  };

  getCurrentWorkout = userId => {
    return this.db.any(
      `SELECT distinct e.name, e.id, e.body FROM exercises e JOIN workouts w 
        on e.id = ANY (w.exercises)
        where w.is_active = true and $1 = ANY (w.users) `,
      [userId]
    );
  };
}

module.exports = Dao;
