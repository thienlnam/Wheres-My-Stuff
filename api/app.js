const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Add routes for containers/parts etc.
const partsRouter = require('./routes/parts');
const containersRouter = require('./routes/containers');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');
const categorizedRouter = require('./routes/categorized');
const exportRouter = require('./routes/export');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/Parts', partsRouter);
app.use('/Containers', containersRouter);
app.use('/Categories', categoriesRouter);
app.use('/Users', usersRouter);
app.use('/Categorized', categorizedRouter);
app.use('/Export', exportRouter);

module.exports = app;
