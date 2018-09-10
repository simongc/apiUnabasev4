const routes = require('express').Router();



const auth = require('./auth');
routes.use('/auth', auth);

const users = require('./users');
routes.use('/users', users);


module.exports = routes;
