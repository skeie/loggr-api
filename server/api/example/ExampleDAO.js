const bindAll = require('lodash/bindAll');
const exampleSql = require('./exampleSql');

class RouteDAO {

    constructor({ app }) {
        this.db = app.locals.dbHandler;
        bindAll(this, 'getExamples');
    }


    /**
     * Return either a transaction handler (if defined)
     * or this.db
     * @param  {Transaction} t transaction handler
     */
    resolveDb(t) { return t || this.db; }

    getExamples(example) {

        // example of using transactions
        // otherwise, just do this.db.any('SELECT ...', [arg1..])
        return this.db.tx((t) => {
            return this.resolveDb(t).oneOrNone(exampleSql.GET)
        });   
    }
}

module.exports = RouteDAO;
