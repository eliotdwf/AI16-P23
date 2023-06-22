const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const logger = require('morgan');

const indexRouter = require('./routes/indexRoute');
const usersRouter = require('./routes/usersRoute');
const organisationRouter = require('./routes/organisationRoute');
const offresRouter = require('./routes/offreRoute');
const candidatureRouter = require('./routes/candidatureRoute');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cookieDuration = 60;
app.use(sessions({
  name: "test",
  secret: "test",
  saveUninitialized: true,
  //cookie: {maxAge: cookieDuration},
  resave : false
}));

app.use(cookieParser())
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/organisations', organisationRouter);
app.use('/offres', offresRouter);
app.use('/candidatures', candidatureRouter);
app.use((req, res) => {
  res.redirect('/404');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
