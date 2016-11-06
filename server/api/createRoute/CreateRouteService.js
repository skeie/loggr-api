const CreateRouteDAO = require('./CreateRouteDAO');
const logger = require('../../../libs/fruits-logger');
const bindAll = require('lodash.bindall');
const VerticeService = require('../vertice/VerticeService');

class CreateRouteService {

    constructor({ app }) {
        this.messageBus = app.locals.messageBus;
        this.createRouteDAO = new CreateRouteDAO({ app });
        this.verticeService = new VerticeService({ app });

        bindAll(this, 'postRoute');
    }

    /**
     * @param  {ExampleModel} example
     */
    postRoute(route) {

        return this.createRouteDAO.post(route)
            .then((routeId) => {
                this.verticeService.createBasedOnList(route.vertices, routeId);
                return { };
            })
            .catch((err) => {
                logger.info('Failed to get examples: ', err, route);
                throw err;
            });
    }
}

module.exports = CreateRouteService;
