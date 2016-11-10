const bindAll = require('lodash.bindall');

class BaseService {

    constructor({ app }) {
        this.messageBus = app.locals.messageBus;
        this.db = app.locals.dbHandler;

        bindAll(this, 'getTransaction');
    }

    getTransaction (cb) { return this.db.tx(cb); }
}

module.exports = BaseService;