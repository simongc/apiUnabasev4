const routes = require('express').Router();



const auth = require('./auth');
routes.use('/auth', auth);

const users = require('./users');
routes.use('/users', users);

const business = require('./business');
routes.use('/business', business);


module.exports = routes;
