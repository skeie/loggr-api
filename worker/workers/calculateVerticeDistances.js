const Promise = require('bluebird');
const logger = require('../../libs/fruits-logger');

// TODO: swich with brakes
const request = require('good-guy-http')({
    timeout: 6000,
    postprocess: false
});

function calculateVerticeDistances ({ routeId, dbHandler }) {

    return new Promise((resolve, reject) => {

        return getVenuesPlaceIdsAndGEOForRoute(routeId, dbHandler)
        .then((venues) => {
            if (venues && venues.length ) {
                return resolve(createAndValidateDistanceMatrix({ routeId, venues }));
            } else {
                logger.warn(`calculateVerticeDistances() - failed to get venues place Ids. RouteId: ${routeId} `);
                return resolve();
            }
        })
        .catch(reject);
    });
}

function getVenuesPlaceIdsAndGEOForRoute (routeId, dbHandler) {
    const SQL = `select ven.google_id AS "googleId", ven.lat, ven.lng from venues ven, vertices vert
    where vert.venue_id = ven.id and vert.route_id = $1 order by vert.sort_order`;

    return dbHandler.many(SQL, [routeId]);
}

function createAndValidateDistanceMatrix ({ routeId, venues }) {
    return new Promise((resolve, reject) => {
        
        return postDistanceMatrix({ routeId, venues })
        .then((distanceMatrix) => {
            const res = isValidDistanceMatrix(distanceMatrix) ? distanceMatrix : {};
            return resolve(res);
        })
        .catch(reject);
    });
}

/**
* @param {Array} venues contains place_id, lat, lng
*                lat,lng is used if you dont have place_id
*/
function postDistanceMatrix ({ routeId, travelmode, venues, force }) {

    // TODO: get real url
    const url = 'http://localhost:8002/api/v1/directions/createDistanceMatrix';
    const body = {
        routeId,
        venues,
        force: true,
    };

    logger.info('Posting distance matrix: ', body);

    return request({
        url,
        method: 'POST',
        json: true,
        body,
    })
    .then((res) => {
        return res.body;
    })
    .catch((err) => {
        logger.warn({what: 'createDistanceMatrix()-failed', err: (err ? err.message : '')});
        throw err;
    });
}

function isValidDistanceMatrix (distanceMatrix) {
    if (distanceMatrix && distanceMatrix.length) {
        return !!distanceMatrix.filter(direction => (direction && direction.routes && direction.routes.length > 0)).length;
    } else {
        return false;
    }
}

module.exports = calculateVerticeDistances;