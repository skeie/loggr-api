const CreateRouteDAO = require('./CreateRouteDAO');
const logger = require('../../../libs/fruits-logger');
const bindAll = require('lodash.bindall');
const VerticeService = require('../vertice/VerticeService');

class CreateRouteService {

    constructor({ app }) {
        this.messageBus = app.locals.messageBus;
        this.db = app.locals.dbHandler;
        this.createRouteDAO = new CreateRouteDAO({ app });
        this.verticeService = new VerticeService({ app });

        bindAll(this, 'postRoute');
    }

    postRoute (route) {
        return this.db.tx(async () => {
            const routeId = await this.createRouteDAO.post(route);
            return Promise.all(route.vertices.map((vertice) => (
                this.verticeService.create(vertice, routeId)
            ))
            );
        })
        .then(data =>  data)
        .catch(error =>  error)
    }

}

module.exports = CreateRouteService;

