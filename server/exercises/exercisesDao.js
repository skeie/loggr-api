import { exercisesMapper, exerciseMapper } from './exercisesMapper';
import lodash from 'lodash';
class Dao {
    constructor(db, dao) {
        this.db = db || require('../lib/dbConnection').db;
        const CommonDao = dao || require('../common/dao');
        this.commonDao = new CommonDao();
    }

    getAll = (userId, currentWorkout) => {
        return this.db
            .query(
                `
      SELECT DISTINCT (elements.exercise_id), elements.id, name, body, index, amount, exercises.updated
      FROM exercises, elements
      WHERE elements.exercise_id = exercises.id AND user_id = ${userId} order by elements.id`
                // need to order by elements.id to have the right sequence in grid
            )
            .then(data => {
                return exercisesMapper(data, currentWorkout);
            })
            .catch(error => {
                return error;
            });
    };

    getWorkoutExercise = exercises => {
        return this.db
            .query(
                `
     SELECT DISTINCT (elements.exercise_id), elements.id, name, body, index, amount, exercises.updated
      FROM exercises, elements
      WHERE elements.exercise_id = ANY (VALUES ${this._generateExerciseIds(
                    exercises
                )}) AND elements.exercise_id = exercises.id order by elements.id`
                // need to order by elements.id to have the right sequence in grid
            )
            .then(data => exercisesMapper(data))
            .catch(error => {
                console.log(error);
                return error;
            });
    };

    _generateExerciseIds = exercises => {
        return exercises.map(exercise => `(${exercise.id})`).toString();
    };

    getOne = id => {
        return this.db
            .query(
                `select exercises.id as "exerciseId", elements.id, name, body, index, amount from exercises, elements where exercises.id = ${id} AND elements.exercise_id = exercises.id order by index`
            )
            .then(data => {
                return exerciseMapper(data);
            })
            .catch(error => {
                return error;
            });
    };

    postOne = (exercise, userId) => {
        return new Promise((resolve, reject) => {
            let newExercise = Object.assign({}, exercise);
            newExercise.userId = userId;
            const query = 'INSERT INTO exercises(name, body, user_id) VALUES(${name}, ${body}, ${userId}) returning id';
            return this.commonDao.insert(query, newExercise).then(data => {
                const { id } = data;
                this.postThreeElements(id, exercise.sets).then(() => {
                    this.getOne(id).then(newExercise => resolve(newExercise));
                });
            });
        });
    };

    postThreeElements = (exerciseId, times = '3') => {
        const query = 'INSERT INTO elements (index, amount, exercise_id) values (${i}, 0, ${exerciseId}) returning id';
        return Promise.all(
            lodash.times(
                parseInt(times, 10),
                i => this.commonDao.insert(query, { i, exerciseId })
            )
        );
        // return Promise.all([
        //   this.commonDao.insert(query, { i: 0, exerciseId }),
        //   this.commonDao.insert(query, { i: 1, exerciseId }),
        //   this.commonDao.insert(query, { i: 2, exerciseId })
        // ]);
    };

    postElement = (amount, index, exerciseId) => {
        const data = { amount, index, exerciseId };
        const query = 'INSERT INTO elements(amount, index, exercise_id) VALUES(${amount}, ${index}, ${exerciseId})';
        return this.commonDao(query, data);
    };

    delete = (id, table) => {
        return this.db.none(`DELETE FROM ${table} where id = ${id}`);
    };
}

module.exports = Dao;
