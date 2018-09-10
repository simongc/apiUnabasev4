const business = require('express').Router();

business.get('/', ctl.list);
business.get('/:id', ctl.get);
business.post('/', ctl.gets);
// business



module.exports = business;