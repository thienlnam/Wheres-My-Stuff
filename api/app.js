const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Add routes for containers/parts etc.
const indexRouter = require('./routes/index');
const partsRouter = require('./routes/parts');
const containersRouter = require('./routes/containers');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/Parts', partsRouter);
app.use('/Containers', containersRouter);
app.use('/Categories', categoriesRouter);
app.use('/Users', usersRouter);

module.exports = app;
