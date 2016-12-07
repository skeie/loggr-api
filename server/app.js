import express from 'express';
import dbConnection from './lib/dbConnection';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import exercises from './exercises/exercisesRouter';
import methodOverride from 'method-override';
import expressValidator from 'express-validator';
import element from './elements/elementRouter';

const favIconPath = '/public/favicon.ico';
const favPath = process.env.NODE_ENV === 'prod' ?
  (path.resolve('.') + '/server/' + favIconPath) : (__dirname + favIconPath);
var app = express();

app.set('port', (process.env.PORT || 3000));
// connect to postgres
dbConnection.pingPostgres();
// debug url
app.use(favicon(favPath));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator([]));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/exercises', exercises);
app.use('/elements', element);

app.get('*', (req, res, next) => {
  res.json({ hello: 'world' });
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});


module.exports = app;
