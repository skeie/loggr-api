const CreateRouteDAO = require('./CreateRouteDAO');
const BaseService = require('../apihelpers/BaseService');
const logger = require('../../../libs/fruits-logger');
const bindAll = require('lodash.bindall');
const repairVerticeSortorder = require('./repairVerticeSortorder');

class CreateRouteService extends BaseService {

    constructor({ app }) {
        super({ app });
        this.createRouteDAO = new CreateRouteDAO({ app });

        bindAll(this, 'postRoute');

        let that = this;
        setTimeout(() => {
            that.messageBus.spiceVenuesInRoute({ routeId: 3917 });
        }, 100)
    }

    postRoute (route) {
        return this.getTransaction(async (tx) => {

            // vertices might have broken sortorder.
            // some verts might not have sortorder,
            // others might have equal sortorder, etc.

            // this function guarantees that no matter how
            // bad the data is, a valid sortorder sequence is generated
            route.vertices = repairVerticeSortorder(route.vertices || []);
            this.fixCity(route);

            try {
                const routeId = await this.createRouteDAO.createRoute(route, tx);
                await this.createRouteDAO.addBucketsToRoute(route.buckets || [], routeId, tx);
                await this.createRouteDAO.addRouteAdmin(route.userId, routeId, tx);
                await this.createRouteDAO.addVerticesToRoute(route.vertices || [], routeId, tx);
                return routeId;

            } catch (err) {
                logger.warn('Failed to create route', err);
                throw err;
            }

            // TODO:
            // flush redis cache
        })

        // trigger rabbit, after transaction.
        .then(routeId => {
            this.messageBus.spiceVenuesInRoute({ routeId });
            this.messageBus.publishNewRoute({ routeId });
            this.messageBus.publishStoreDuration({ routeId });
            this.messageBus.publishTakeRouteScreenshot({ routeId });
            this.messageBus.publishClearRedisCache({ cityName: route.city });
            return routeId;
        });
    }

    fixCity (route) {
        if (route.city) { return route.city; }

        route.vertices.forEach(v => {
            if (v.city) {
                route.city = v.city;
            }
        });

        if (route.city) { return route.city; }
        else {

            // probably a bug with the app, 
            // seeing every vertice should always have a city.
            throw new Error('Route did not have a city');

        }
    }

}

module.exports = CreateRouteService;

