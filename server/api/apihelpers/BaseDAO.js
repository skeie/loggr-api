const bindAll = require('lodash.bindall');

class BaseDAO {

    constructor({ app }) {
        this.db = app.locals.dbHandler;
        bindAll(this, 'resolveDb');
    }

    /**
     * Return either a transaction handler (if defined)
     * or this.db
     * @param  {Transaction} t transaction handler
     */
    resolveDb(t) { return t || this.db; }
}

module.exports = BaseDAO;