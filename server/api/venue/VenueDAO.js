const bindAll = require('lodash.bindall');


class CreateRouteDAO {

    constructor({ app }) {
        this.db = app.locals.dbHandler;
        // bindAll(this, 'postCreateRoute');
    }

    /*
* @param {string} externalIdKey google_id | yelp_id | foursquare_id | null
*/
    createNewVenue (venue, externalIdKey, externalId) {

        if (venue.geometry) {

            // logger.info('Create venue with geometry', venue.geometry);

            const geo = JSON.stringify(venue.geometry);

            if (externalIdKey) {
                // TODO: remove geometry
                return this.db.query(`insert into venues (${externalIdKey}, geometry, address, title, lat, lng)
                values ($1,$2,$3, $4, $5, $6) returning id`,
                    [externalId, geo, venue.address, venue.title, venue.geometry.lat, venue.geometry.lng]);

            } else {
                return this.db.query('insert into venues (geometry, address, title, lat, lng) values ($1,$2,$3, $4, $5) returning id;',
                    [geo, venue.address, venue.name, venue.geometry.lat, venue.geometry.lng]);
            }



        } else {
            // logger.info('Create venue without geometry');
            return this.db.query('insert into venues DEFAULT VALUES returning id;');
        }
    }

}

module.exports = CreateRouteDAO;
