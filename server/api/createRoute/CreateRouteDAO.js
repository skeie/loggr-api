const Promise = require('bluebird');
const bindAll = require('lodash.bindall');
const get = require('lodash.get');
const isNumber = require('lodash.isnumber');
const BaseDAO = require('../apiHelpers/BaseDAO');
const logger = require('../../../libs/fruits-logger');
const { 
    CREATE,
    UPSERT_BUCKET,
    CREATE_BUCKET_ROUTE,
    APPEND_ROUTE_BUCKET,
    GET_BUCKET_ID,
    CREATE_ROUTE_ADMIN,
    GET_VENUE,
    CREATE_VENUE,
    CREATE_VERTICE,
    CREATE_VERTICE_PHOTO,
    APPEND_VERTICE_BUCKETS
} = require('./createRouteSql');

const DEFAULT = 'DEFAULT';

class CreateRouteDAO extends BaseDAO {

    constructor({ app }) {
        super({ app });
        bindAll(this, 'createRoute', 'addBucketsToRoute', 'addBucketToRoute', 
            'addRouteAdmin', 'addVerticesToRoute', 'addVerticeToRoute', 'upsertVenue',
            'addPhotosToVertice', 'addBucketsToVertice');
    }

    createRoute(route, tx) {
        return this.resolveDb(tx).one(
            CREATE, [
                route.title || DEFAULT,
                route.description || '',
                route.city
            ]
        )
            .then(res => res.id)
            .catch(err => {
                logger.info('Failed to create route', err);
                throw err;
            });
    }

    addBucketsToRoute(bucketNames, routeId, tx) {
        return Promise.all(bucketNames.map(b => 
            this.addBucketToRoute((b || '').toLowerCase(), routeId, tx)));
    }

    addBucketToRoute(bucketName, routeId, tx) {
        return this
            .resolveDb(tx)
            .none(UPSERT_BUCKET, [bucketName])
            .then(() => tx.one(GET_BUCKET_ID, [bucketName]))
            .then(({ id }) => tx.none(CREATE_BUCKET_ROUTE, [id, routeId]))
            .then(() => tx.none(APPEND_ROUTE_BUCKET, [bucketName, routeId]));
    }

    addRouteAdmin (userId, routeId, tx) {
        return this
            .resolveDb(tx)
            .none(CREATE_ROUTE_ADMIN, [userId, routeId]);
    }

    addVerticesToRoute (vertices, routeId, tx) {
        return Promise.all(vertices.map(v => 
            this.addVerticeToRoute(v, routeId, tx)));
    }

    // TODO: correctVerticeSortorder(route.vertices);
    addVerticeToRoute (vert, routeId, tx) {
        let verticeId;
        return this
            .upsertVenue(vert.venue, tx)
            .then(venueId => this.createVertice(routeId, venueId, vert, tx))
            .then(({ id }) => {
                verticeId = id;
                return this.addPhotosToVertice(verticeId, vert.photos, tx);
            })
            .then(() => this.addBucketsToVertice(vert.buckets, verticeId, tx));
    }

    createVertice (routeId, venueId, vert, tx) {
        return tx.one(CREATE_VERTICE,
            [routeId, venueId, vert.title, vert.description, get(vert, 'photos[0].url', null),
            get(vert, 'photos[0].photoSource', null), vert.sortorder])
    }

    /**
     * @returns {String} id the venueid
     */
    upsertVenue (venue = {}, tx) {
        const NON_EXISTING_ID = 0;

        // source ids (yelp_id, foursquare_id etc) are varchars
        const NON_EXISTING_SOURCE_ID = 'NON_EXISTING_ROUTES_SOURCE_ID';

        const yelpId = venue.yelp_id || NON_EXISTING_SOURCE_ID;
        const foursquareId = venue.foursquare_id || NON_EXISTING_SOURCE_ID;
        const googleId = venue.place_id || venue.googleId || NON_EXISTING_SOURCE_ID;

        // venueId are usually temporary generated strings in routes-native 
        const id = isNumber(venue.id) ? venue.id : NON_EXISTING_ID;

        if (!get(venue, 'geometry.lat') || !get(venue, 'geometry.lng')) {
            throw new Error(`Venue must have valid geometry ${JSON.stringify(venue)}`);
        }

        return tx
            .oneOrNone(GET_VENUE, [yelpId, foursquareId, googleId, id])
            .then(venueId => venueId ?

                // venue existed, return id 
                venueId :

                // venue did not exist, create it
                tx.one(CREATE_VENUE, [
                    venue.yelp_id, 
                    venue.foursquare_id,
                    venue.place_id || venue.googleId,
                    venue.geometry,
                    venue.address,
                    venue.name,
                    venue.geometry.lat,
                    venue.geometry.lng                    
                ]) 
            )
            .then(v => v.id);
    }

    // TODO: make sure all these fields are included 
    addPhotosToVertice (verticeId, images = [], tx ) {
        return Promise.all(images.map(image => {
            if (!image.url) { throw new Error(`Image must have url! ${image}`); }

            return tx.none(CREATE_VERTICE_PHOTO, 
                [verticeId, image.url, image.photoSource, image.externalLink, image.username]);
        }));
    }

    addBucketsToVertice(buckets = [], verticeId, tx) {
        const mappedBuckets = buckets.map(b => b.toLowerCase());

        // upsert buckets
        return Promise.all(mappedBuckets.map(b => tx.none(UPSERT_BUCKET, b)))

            // append all buckets to vertice
            .then(() => 

                // this breaks if buckets.length === 0;
                buckets.length > 0 ? 
                    tx.none(APPEND_VERTICE_BUCKETS, [mappedBuckets, verticeId]) :
                    Promise.resolve()
            );
    }
}

module.exports = CreateRouteDAO;
