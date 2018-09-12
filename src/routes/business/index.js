const business = require('express').Router();

business.get('/', ctl.get);
business.post('/', ctl.gets);
business.post('/create', ctl.create);
business.get('/:id', ctl.read);
business.put('/:id', ctl.update)
// business



module.exports = business;