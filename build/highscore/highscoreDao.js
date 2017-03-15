'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dao = function Dao(db, dao) {
    var _this = this;

    _classCallCheck(this, Dao);

    this.getAll = function () {
        return _this.db.query('select user_id as userId, highscore, name from highscore inner join users s on s.id = user_id  order by highscore desc limit 5;').then(function (data) {
            return data;
        }).catch(function (error) {
            console.log(error);
            return error;
        });
    };

    this.get = function (userId) {
        return _this.db.query('\n      WITH summary AS (\n        SELECT h.*,\n          ROW_NUMBER() OVER(ORDER BY highscore DESC) AS position FROM highscore h)\n        SELECT position FROM summary s\n        WHERE s.user_id = ' + userId).then(function (data) {
            return data;
        }).catch(function (error) {
            return error;
        });
    };

    this.create = function (userId, highscore) {
        return _this.db.one('insert into highscore(user_id, highscore) values($1, $2) returning id', [userId, highscore]).then(function (_ref) {
            var id = _ref.id;

            return id;
        }).catch(function (error) {
            console.log('ERROR:', error.message || error); // print error;
        });
    };

    this.db = db || require('../lib/dbConnection').db;
    var CommonDao = dao || require('../common/dao');
    this.commonDao = new CommonDao();
};

module.exports = Dao;
//# sourceMappingURL=highscoreDao.js.map