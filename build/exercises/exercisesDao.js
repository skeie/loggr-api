'use strict';

var _exercisesMapper = require('./exercisesMapper');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dao = function Dao(db, dao) {
    var _this = this;

    _classCallCheck(this, Dao);

    this.getAll = function (userId, currentWorkout) {
        return _this.db.query('\n      SELECT DISTINCT (elements.exercise_id), elements.id, name, body, index, amount, exercises.updated\n      FROM exercises, elements\n      WHERE elements.exercise_id = exercises.id AND user_id = ' + userId + ' order by elements.id'
        // need to order by elements.id to have the right sequence in grid
        ).then(function (data) {
            return (0, _exercisesMapper.exercisesMapper)(data, currentWorkout);
        }).catch(function (error) {
            return error;
        });
    };

    this.getWorkoutExercise = function (exercises) {
        return _this.db.query('\n     SELECT DISTINCT (elements.exercise_id), elements.id, name, body, index, amount, exercises.updated\n      FROM exercises, elements\n      WHERE elements.exercise_id = ANY (VALUES ' + _this._generateExerciseIds(exercises) + ') AND elements.exercise_id = exercises.id order by elements.id'
        // need to order by elements.id to have the right sequence in grid
        ).then(function (data) {
            return (0, _exercisesMapper.exercisesMapper)(data);
        }).catch(function (error) {
            console.log(error);
            return error;
        });
    };

    this._generateExerciseIds = function (exercises) {
        return exercises.map(function (exercise) {
            return '(' + exercise.id + ')';
        }).toString();
    };

    this.getOne = function (id) {
        return _this.db.query('select exercises.id as "exerciseId", elements.id, name, body, index, amount from exercises, elements where exercises.id = ' + id + ' AND elements.exercise_id = exercises.id order by index').then(function (data) {
            return (0, _exercisesMapper.exerciseMapper)(data);
        }).catch(function (error) {
            return error;
        });
    };

    this.postOne = function (exercise, userId) {
        return new Promise(function (resolve, reject) {
            var newExercise = Object.assign({}, exercise);
            newExercise.userId = userId;
            var query = 'INSERT INTO exercises(name, body, user_id) VALUES(${name}, ${body}, ${userId}) returning id';
            return _this.commonDao.insert(query, newExercise).then(function (data) {
                var id = data.id;

                _this.postThreeElements(id, exercise.sets).then(function () {
                    _this.getOne(id).then(function (newExercise) {
                        return resolve(newExercise);
                    });
                });
            });
        });
    };

    this.postThreeElements = function (exerciseId) {
        var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '3';

        var query = 'INSERT INTO elements (index, amount, exercise_id) values (${i}, 0, ${exerciseId}) returning id';
        return Promise.all(_lodash2.default.times(parseInt(times, 10), function (i) {
            return _this.commonDao.insert(query, { i: i, exerciseId: exerciseId });
        }));
        // return Promise.all([
        //   this.commonDao.insert(query, { i: 0, exerciseId }),
        //   this.commonDao.insert(query, { i: 1, exerciseId }),
        //   this.commonDao.insert(query, { i: 2, exerciseId })
        // ]);
    };

    this.postElement = function (amount, index, exerciseId) {
        var data = { amount: amount, index: index, exerciseId: exerciseId };
        var query = 'INSERT INTO elements(amount, index, exercise_id) VALUES(${amount}, ${index}, ${exerciseId})';
        return _this.commonDao(query, data);
    };

    this.delete = function (id, table) {
        return _this.db.none('DELETE FROM ' + table + ' where id = ' + id);
    };

    this.db = db || require('../lib/dbConnection').db;
    var CommonDao = dao || require('../common/dao');
    this.commonDao = new CommonDao();
};

module.exports = Dao;
//# sourceMappingURL=exercisesDao.js.map