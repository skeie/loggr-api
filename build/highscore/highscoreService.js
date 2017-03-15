'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = function Service(dao, commonDao) {
    var _this = this;

    _classCallCheck(this, Service);

    this.update = function (userId, amount) {
        return _this.dao.getOne(id);
    };

    this.getAll = function (userId) {
        return Promise.all([_this.dao.getAll(), _this.dao.get(userId)]).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                highscore = _ref2[0],
                userHighScore = _ref2[1];

            return Promise.resolve({ highscore: highscore, userHighScore: userHighScore });
        });
    };

    this.create = function (userId, isOldUser) {
        // generate highscore based on exercises
        return _this.dao.create(userId, 0);
    };

    var HighscoreDao = dao || require('./highscoreDao');
    var CommonDao = commonDao || require('../common/dao');
    var ExerciseDao = require('../exercises/exercisesDao');
    this.exerciseDao = new ExerciseDao();
    this.dao = new HighscoreDao();
    this.commonDao = new CommonDao();
};

module.exports = Service;
//# sourceMappingURL=highscoreService.js.map