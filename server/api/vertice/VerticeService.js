const VerticeDAO = require('./VerticeDAO');
const logger = require('../../../libs/fruits-logger');
const bindAll = require('lodash.bindall');
const spicesClient = require('../social/spiceClient');
const VenueDAO = require('../venue/VenueDAO');

class CreateRouteService {

    constructor({ app }) {
        this.verticeDAO = new VerticeDAO({ app });
        this.venueDAO = new VenueDAO({ app });
        // bindAll(this, 'postRoute');
    }

    createBasedOnList (vertices, routeId) {
        const createVertice = [];
        vertices.forEach(vertice => {
            createVertice.push(this.create(vertice, routeId));
        });
        return Promise.all(createVertice);
    }

    create (data, routeId) {

        let verticeId, venueId, spicePollId, venueSocial;

        return new Promise((resolve, reject) => {

            this.upsert(data.venue)
                .then((id) => {

                    venueId = id;

                    return this.verticeDAO.createVertice({
                        venue_id: venueId,
                        route_id: routeId,
                        title: data.title,
                        foursquareVenue: data.foursquareVenue,
                        instagramVenue: data.instagramVenue,
                        type: data.type,
                        description: data.description,
                        sortorder: data.sortorder,
                        color: data.color,
                        price: data.price,
                    });
                })
                .then((res) => {
                    if (!res.rowCount) {
                        return new Error('Failed to create vertice');
                    }
                    verticeId = res.rows[0].id;

                    return spicesClient.putSpiceOnVenue(venueId, data.venue);
                })
                .then((venueOrPollId) => {
                    if (typeof venueOrPollId === 'string') {

                        // we are creating new
                        spicePollId = venueOrPollId;
                    } else {

                        // venueSocial already exists
                        venueSocial = venueOrPollId;
                    }

                    // rabbitConnection.publishInvalidateDirectionsCache(data.routeId);

                    resolve({
                        verticeId,
                        venue: {
                            id: venueId,
                            spicePollId,
                            venueSocial,
                        }
                    });
                })
                .catch((err) => {
                    logger.warn('Failed during create vertice ', err);

                    // probably something went wrong with add spices. Resolve anyway
                    if (verticeId) {
                        resolve({
                            verticeId,
                            venue: { id: venueId },
                        });
                    } else {
                        reject(err);
                    }
                });
        });
    }

    upsert(venue) {

        // google is old special case here (legacy)
        var googleId = venue.place_id || venue.googleId || '';
        var venueId;
        let externalIdKey, externalId;

        // resolve where this venue has external id from
        // this part is a bit hackish. cleanup soon
        if (venue.foursquareId) {
            externalIdKey = 'foursquare_id';
            externalId = venue.foursquareId;
        }
        else if (venue.yelpId) {
            externalIdKey = 'yelp_id';
            externalId = venue.yelpId;
        }
        else if (googleId) {
            externalIdKey = 'google_id';
            externalId = googleId;
        }

        return this.verticeDAO.tryFetchVenue(venue, externalIdKey, externalId)

            // venue doesnt exist
            .then((res) => {

                if (!res.rowCount) {

                    // create new venue
                    return this.venueDAO.createNewVenue(venue, externalIdKey, externalId);

                    // venue exists. return it
                } else {
                    // logger.info({ type: 'info', what: 'Venue exists', googleId: googleId });

                    const orgVenue = res.rows[0];
                    venueId = orgVenue.id;
                    return this.update(venue, orgVenue);

                }
            })
            .then((res) => {
                // venue existed
                if (venueId) { return venueId; }
                const { id } = res[0];

                // venue was just created
                return id;
            });
    }

}

module.exports = CreateRouteService;
