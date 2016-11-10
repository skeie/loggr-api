const CreateRouteDAO = require('./CreateRouteDAO');
const BaseService = require('../apiHelpers/BaseService');
const logger = require('../../../libs/fruits-logger');
const bindAll = require('lodash.bindall');
const VerticeService = require('../vertice/VerticeService');

class CreateRouteService extends BaseService {

    constructor({ app }) {
        super({ app });
        this.createRouteDAO = new CreateRouteDAO({ app });
        this.verticeService = new VerticeService({ app });

        bindAll(this, 'postRoute');
    }

    postRoute (route) {
        return this.getTransaction(async (tx) => {

            try {
                const routeId = await this.createRouteDAO.createRoute(route, tx);
                this.createRouteDAO.createBuckets();

                // TODO: continue here :)
                console.log('SAPPERN NÅ ', routeId);
                return routeId;

            } catch (err) {
                logger.info('Failed to create route', err);
                throw err;
            }

            // .then((result) => {
            //     console.log('sappern ', result);
            //     return result;
            // });

            // save route meta
                // save route buckets
            // save oute admin
            // for each vertice
                // upsert venue
                // save vertice
                // save vertice photos
                // save vertice buckets

            // save duration
            // save distance
            // take screenshot
            // create card
            // flush redis cache


            // return Promise.resolve(1337);

            // const routeId = await this.createRouteDAO.post(route);
            // return Promise.all(route.vertices.map((vertice) => (
            //     this.verticeService.create(vertice, routeId)
            // ))
            // );
        });
    }

}

module.exports = CreateRouteService;

