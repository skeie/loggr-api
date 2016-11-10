const VerticeDAO = require('./VerticeDAO');
const logger = require('../../../libs/fruits-logger');
const bindAll = require('lodash.bindall');
const spicesClient = require('../social/spiceClient');
const VenueDAO = require('../venue/VenueDAO');
const { get } = require('lodash');

class CreateRouteService {

    constructor({ app }) {
        this.verticeDAO = new VerticeDAO({ app });
        this.venueDAO = new VenueDAO({ app });
        this.db = app.locals.dbHandler;
    }
}

module.exports = CreateRouteService;
