const cors = require('cors');
const express = require('express');
const paginate = require('express-paginate');
const passport = require('passport');

// Local imports
const router = require('./routes/index');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
// Accept form data
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(paginate.middleware(process.env.LIMIT, process.env.MAX_LIMIT));

app.use(router);

module.exports = app;
