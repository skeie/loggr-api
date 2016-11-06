const bindAll = require('lodash.bindall');
const { getPostRouteQuery } = require('./createRoutesql');

class CreateRouteDAO {

    constructor({ app }) {
        this.db = app.locals.dbHandler;
        bindAll(this, 'post');
    }

    post(route) {
        return this.insertRoute(route)
        .then(res => {
            const { id } = res[0];
            return id;
        })
        .catch(err => err);
    }

    insertRoute (route, t) {
        return this.resolveDb(t).query(
            getPostRouteQuery, [
                route.title || 'DEFAULT',
                route.description || '',
                route.anyone_can_edit || false,
                route.active || false,
            ]
        );
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
