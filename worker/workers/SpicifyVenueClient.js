const Promise = require('bluebird');
const logger = require('../../libs/fruits-logger');
const bindAll = require('lodash.bindall');

// TODO: swich with brakes
const request = require('good-guy-http');


class SpicifyVenueClient {

    constructor ({ config }) {
        this.config = config;

        this.request = request({
            timeout: 8000,
            postprocess: false,
        });

        bindAll(this, 'spicify');
    }

    spicify (venue) {
        const url = `${this.config.SOCIAL_SERVICE_URI}/api/v1/spices/putSpicesOnVenue`;
        const body = {
            venueId: venue.id,
            venue,
            force: true,
        };

        logger.info('Spicing venue: ', { extras: body });

        return this.request({
            url,
            method: 'POST',
            json: true,
            body,
        })
        .then((res) => {
            logger.info('Spicify won', { extras: venue.id });
            return res;
        })
        .catch((err) => {
            logger.warn('spicify()-failed', err);
            throw err;
        });
    }
}

module.exports = SpicifyVenueClient;
