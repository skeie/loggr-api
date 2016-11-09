const bindAll = require('lodash.bindall');
const VenueDAO = require('../venue/VenueDAO');
class VerticeDAO {

    constructor({ app }) {
        this.db = app.locals.dbHandler;
        this.venueDAO = new VenueDAO({ app });
        // bindAll(this, 'postCreateRoute');
    }

    /**
     * Return either a transaction handler (if defined)
     * or this.db
     * @param  {Transaction} t transaction handler
     */
    resolveDb(t) { return t || this.db; }

    createVertice(vertice, t) {
        const query = 'insert into vertices (route_id, venue_id, title, description,' +
            ' type, color, price, foursquare_venue, instagram_venue, sort_order) values ' +
            '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id;';

        return this.resolveDb(t).query(query, [
            vertice.route_id,
            vertice.venue_id,
            vertice.title || '',
            vertice.description,
            vertice.type,
            vertice.color,
            vertice.price,
            vertice.foursquareVenue,
            vertice.instagramVenue,
            vertice.sortorder,
        ]);
    }


    update(newVenue, orgVenue) {

        let keys = Object.keys(newVenue);

        if (!keys.length) {
            return Promise.resolve({});
        }

        const whiteList = ['geometry', 'address', 'title'];

        let query = 'UPDATE venues SET ';
        const args = [];

        whiteList.forEach((key) => {

            if (newVenue[key]) {

                query += `${key}=$${args.length + 1}, `;

                // TODO: drop geometry here
                // and test this shit
                if (key === 'geometry') {
                    args.push(JSON.stringify(newVenue[key]));
                    query += `lat=$${args.length + 1}, `
                    args.push(newVenue[key].lat);
                    query += `lng=$${args.length + 1}, `
                    args.push(newVenue[key].lng);

                } else {
                    args.push(newVenue[key]);
                }
            }

        });

        query += `updated=now() WHERE id=$${args.length + 1};`;
        args.push(orgVenue.id);

        return this.db.query(query, args);
    }

    tryFetchVenue(venue, externalIdKey, externalId) {

        if (externalIdKey) {
            return this.db.query(`select * from venues where ${externalIdKey}=$1`, [externalId]);
            // return nothing, so it gets created
        } else {
            return Promise.resolve({});
        }
    }

}

module.exports = VerticeDAO;

