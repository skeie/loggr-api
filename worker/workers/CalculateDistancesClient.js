const Promise = require('bluebird');
const logger = require('../../libs/fruits-logger');
const bindAll = require('lodash.bindall');

// TODO: swich with brakes
const request = require('good-guy-http');


class CalculateDistancesClient {

    constructor ({ config, dbHandler }) {
        this.dbHandler = dbHandler;
        this.config = config;

        this.request = request({
            timeout: 6000,
            postprocess: false,
        });

        bindAll(this, 'calculate', '_getVenuesPlaceIdsAndGEOForRoute',
            '_createAndValidateDistanceMatrix', '_postDistanceMatrix', '_isValidDistanceMatrix');
    }

    /**
     * public function to caclulate distances
     * in this route
     * @param {Number} routeId to calculate distances for
     */
    calculate ({ routeId }) {
        return new Promise((resolve, reject) => this._getVenuesPlaceIdsAndGEOForRoute(routeId)
                .then((venues) => {
                    if (venues && venues.length) {
                        return resolve(this._createAndValidateDistanceMatrix({ routeId, venues }));
                    } else {
                        logger.warn(`calculateVerticeDistances() - failed to get venues place Ids. RouteId: ${routeId} `);
                        return resolve();
                    }
                })
                .catch(reject));
    }

    _getVenuesPlaceIdsAndGEOForRoute (routeId) {
        const SQL = `select ven.google_id AS "googleId", ven.lat, ven.lng from venues ven, vertices vert
    where vert.venue_id = ven.id and vert.route_id = $1 order by vert.sort_order`;

        return this.dbHandler.many(SQL, [routeId]);
    }

    _createAndValidateDistanceMatrix ({ routeId, venues }) {
        return new Promise((resolve, reject) => this._postDistanceMatrix({ routeId, venues })
                .then((distanceMatrix) => {
                    const res = this._isValidDistanceMatrix(distanceMatrix) ? distanceMatrix : {};
                    return resolve(res);
                })
                .catch(reject));
    }

    /**
    * @param {Array} venues contains place_id, lat, lng
    *                lat,lng is used if you dont have place_id
    */
    _postDistanceMatrix ({ routeId, travelmode, venues, force }) {
        // TODO: get real url
        const url = `${this.config.SOCIAL_SERVICE_URI}/api/v1/directions/createDistanceMatrix`;
        const body = {
            routeId,
            venues,
            force: true,
        };

        logger.info('Posting distance matrix: ', body);

        return this.request({
            url,
            method: 'POST',
            json: true,
            body,
        })
            .then((res) => res.body)
            .catch((err) => {
                logger.warn('createDistanceMatrix()-failed', err);
                throw err;
            });
    }

    _isValidDistanceMatrix (distanceMatrix) {
        if (distanceMatrix && distanceMatrix.length) {
            return !!distanceMatrix.filter(direction => (direction && direction.routes && direction.routes.length > 0)).length;
        } else {
            return false;
        }
    }
}

module.exports = CalculateDistancesClient;
