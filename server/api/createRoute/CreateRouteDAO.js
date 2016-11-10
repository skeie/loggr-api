const bindAll = require('lodash.bindall');
const logger = require('../../../libs/fruits-logger');
const { CREATE } = require('./createRoutesql');

const DEFAULT = 'DEFAULT'; 

class CreateRouteDAO {

    constructor({ app }) {
        this.db = app.locals.dbHandler;
        bindAll(this, 'createRoute');
    }

    createRoute(route, tx) {
        return this.resolveDb(tx).one(
            CREATE, [
                route.title || DEFAULT,
                route.description || ''
            ]
        )
        .then(res => res.id)
        .catch(err => {
            logger.info('Failed to create route', err);
            throw err;
        });
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
        // return this.db.tx((t) => {
        //     return this.resolveDb(t).oneOrNone(exampleSql.GET)
        // });
    }
}

module.exports = CreateRouteDAO;
