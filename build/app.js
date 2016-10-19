'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _dbConnection = require('./lib/dbConnection');

var _dbConnection2 = _interopRequireDefault(_dbConnection);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _exercisesRouter = require('./exercises/exercisesRouter');

var _exercisesRouter2 = _interopRequireDefault(_exercisesRouter);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _elementRouter = require('./elements/elementRouter');

var _elementRouter2 = _interopRequireDefault(_elementRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(process.env.DATABASE_URL + " yolo 1337");
var favIconPath = '/public/favicon.ico';
var favPath = process.env.NODE_ENV === 'prod' ? _path2.default.resolve('.') + '/server/' + favIconPath : __dirname + favIconPath;
var app = (0, _express2.default)();

app.set('port', process.env.PORT || 3000);
// connect to postgres
_dbConnection2.default.pingPostgres();
// debug url
app.use((0, _serveFavicon2.default)(favPath));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use((0, _expressValidator2.default)([]));
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _methodOverride2.default)());
app.use((0, _cookieParser2.default)());
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

app.use('/exercises', _exercisesRouter2.default);
app.use('/elements', _elementRouter2.default);

app.get('*', function (req, res, next) {
  res.json({ hello: 'world' });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
//# sourceMappingURL=app.js.map