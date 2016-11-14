const CreateRouteDAO = require('./CreateRouteDAO');
const BaseService = require('../apiHelpers/BaseService');
const logger = require('../../../libs/fruits-logger');
const bindAll = require('lodash.bindall');
const repairVerticeSortorder = require('./repairVerticeSortorder');

class CreateRouteService extends BaseService {

    constructor({ app }) {
        super({ app });
        this.createRouteDAO = new CreateRouteDAO({ app });

        bindAll(this, 'postRoute');
    }

    postRoute (route) {
        return this.getTransaction(async (tx) => {

            // vertices might have broken sortorder.
            // some verts might not have sortorder,
            // others might have equal sortorder, etc.

            // this function guarantees that no matter how
            // bad the data is, a valid sortorder sequence is generated
            route.vertices = repairVerticeSortorder(route.vertices || []);

            try {
                const routeId = await this.createRouteDAO.createRoute(route, tx);
                await this.createRouteDAO.addBucketsToRoute(route.buckets || [], routeId, tx);
                await this.createRouteDAO.addRouteAdmin(route.userId, routeId, tx);
                await this.createRouteDAO.addVerticesToRoute(route.vertices || [], routeId, tx);

                logger.info('Created route', routeId);
                return routeId;

            } catch (err) {
                logger.info('Failed to create route', err);
                console.error('ERROR ', err);
                throw err;
            }

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
            // send email
            // take screenshot
            // create card
            // flush redis cache
        })

        // trigger rabbit, after transaction.
        .then(routeId => {
            this.messageBus.publishNewRoute({ routeId });
            this.messageBus.publishStoreDuration({ routeId });
            this.messageBus.publishTakeRouteScreenshot({ routeId });
            return routeId;
        });
    }

}

module.exports = CreateRouteService;

