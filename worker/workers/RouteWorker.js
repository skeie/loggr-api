const bindAll = require('lodash.bindall');
const path = require('path');
const Promise = require('bluebird');
const get = require('lodash.get');
const isNumber = require('lodash.isnumber');
const logger = require('../../libs/fruits-logger');
const calculateVerticeDistances = require('./calculateVerticeDistances');


class RouteWorker {

    constructor ({ dbHandler }) {
        // this.takeMapShot = props.takeMapShot || require('./takeMapShot');
         this.dbHandler = dbHandler;
         bindAll(this, 'storeDuration', 'mapDurationAndDistance', 'updateRoute');
    }

    storeDuration (job) {
        const {routeId} = job;
        if (!routeId || !isNumber(routeId)) {
            logger.warn(`routeId not defined in storeDuration() ${routeId}`);
            return Promise.reject('routeId not defined in storeDuration() ');
        }

        return calculateVerticeDistances({ routeId, dbHandler: this.dbHandler })
        .then((res) => {
            return this.updateRoute(routeId, this.mapDurationAndDistance(routeId, res));
        })
        .catch((err) => {
            logger.warn('Failed to calculateDistances', err);
            throw err;
        });
    }

    mapDurationAndDistance (routeid, spots) {
        if (!spots) {
            logger.info(`No spots provided: ${routeid}`);
            return {};
        }

        let initValue = {distance: 0, duration: 0};
        let durationAndDistance = spots
            .filter(spot => get(spot, 'routes[0].legs[0].duration') && get(spot, 'routes[0].legs[0].distance'))
            .reduce((prevValue, spot) => {
                prevValue.duration = prevValue.duration + spot.routes[0].legs[0].duration.value;
                prevValue.distance = prevValue.distance + spot.routes[0].legs[0].distance.value;
            return prevValue;
        }, initValue);
        
        // easier to work with miliseconds instead of seconds
        durationAndDistance.duration = durationAndDistance.duration * 1000;

        return durationAndDistance;
    }

    updateRoute (routeId, { duration, distance }) {
        if (isNumber(duration) && isNumber(distance)) {

            const SQL = 'UPDATE routes SET duration=$1, distance=$2 WHERE id = $3';
            return this.dbHandler.none(SQL, [duration, distance, routeId]);
        } else {
            return Promise.reject(`Duration ${duration} or dustance ${distance} wants number. RouteId: ${routeId}`);
        }
    }

    // takeShot (id) {
    //     if (!id) {
    //         throw new Error('Missing id in takeShot()');
    //     }
    //     return new Promise((resolve, reject) => {
    //         queryRouteDetail({routeId: id, populate: ['map_photo AS "mapPhoto"']})
    //         .then((route) => {
    //             if (route && !route.mapPhoto) {
    //                 return this.takeMapShot(id);
    //             } else {
    //                 resolve();
    //             }
    //         }).catch(reject);
    //     });
    // }
    /*


    * calls save on image service
    *       * sends the images to S3
    *       * deletes local references
    * saves s3 references in route table
    */
    // saveRouteCard (route) {

    //     logger.info({what: 'Saving route card', card: route.card, id: route.id});

    //     if (!route.id || !route.card) {
    //         throw new Error('id or card data not defined in saveRouteCard()', route);
    //     }

    //     // create fields that will be saved in update route
    //     const updateData = {
    //         card_image: route.card.normalImage,
    //         card_image_labeled: route.card.labeledImage
    //     };

    //     return updateRoute(route.id, updateData);
    // }


}


module.exports = RouteWorker;
