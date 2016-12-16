const CREATE = 'INSERT INTO routes (title, description, city, active) values ($1, $2, $3, TRUE) RETURNING id';
const UPSERT_BUCKET = 'INSERT INTO buckets (name) VALUES ($1) ON CONFLICT ON CONSTRAINT unique_bucket_name DO NOTHING';
const CREATE_BUCKET_ROUTE = 'INSERT INTO bucket_route (bucket_id, route_id) VALUES ($1, $2)';
const APPEND_ROUTE_BUCKET = 'UPDATE routes SET buckets = array_append(buckets, $1) WHERE id = $2';
const GET_BUCKET_ID = 'SELECT id FROM buckets WHERE name = $1';
const CREATE_ROUTE_ADMIN = 'INSERT INTO route_admin (user_id, route_id) VALUES ($1, $2)';
const GET_VENUE = 'SELECT * FROM venues WHERE yelp_id = $1 OR foursquare_id = $2 OR google_id = $3 OR id = $4';

const CREATE_VENUE = `INSERT INTO venues (yelp_id, foursquare_id, google_id, geometry, address, title, lat, lng)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;

const CREATE_VERTICE = `INSERT INTO vertices (route_id, venue_id, title, description, photo, photo_source, sort_order) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;

const CREATE_VERTICE_PHOTO = `INSERT INTO vertice_photos (vertice_id, url, photo_source, external_link, username)
    VALUES ($1, $2, $3, $4, $5)`;

const APPEND_VERTICE_BUCKETS = 'UPDATE vertices SET buckets = array_cat(buckets, $1) WHERE id = $2'; 

module.exports = {
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
    APPEND_VERTICE_BUCKETS,
};
