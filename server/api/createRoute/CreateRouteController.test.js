'use strict';
const Promise = require('bluebird');
const {createTestApp, setup, teardown, getDbHandle} = require('../testHelpers/helpers');
const uniq = require('lodash.uniq');
const routeFixture = require('./testFixtures');
const assert = require('power-assert');
const request = require('supertest-as-promised');


// NB!
// This test assumes there is a user with id = 1.
describe('create route controller', () => {
    before((done) => {
        setup().then(() => done()).catch(done);
    });

    after((done) => {
        teardown().then(() => done()).catch(done);
    });

    it('should respond with 200', () => (
        request(createTestApp())
        .post('/api/v2/routes')
            .then(response => {
                assert(response.status === 201);

                const routeId = response.body.id;
                assert.ok(routeId > 0, 'Route id was not valid');

                return getDbHandle().one('SELECT * from routes WHERE id = $1', routeId)

                // test route
                .then((route) => {
                    assert.equal(route.title, routeFixture.title);
                    assert.equal(route.city, routeFixture.city);
                    assert.equal(route.description, routeFixture.description);
                    assert.ok(route.active);
                    assert.deepEqual(route.buckets, routeFixture.buckets);
                    return getDbHandle().many('SELECT name FROM buckets');
                })

                // test buckets
                .then((buckets) => {
                    const expectedBuckets = uniq(
                        routeFixture.vertices
                        .reduce((all, curr) => all.concat(curr.buckets), routeFixture.buckets)
                    );

                    assert.deepEqual(buckets.map(b => b.name), expectedBuckets);                    
                    return getDbHandle().many('SELECT * FROM bucket_route');                    
                })

                // bucket routes
                .then((bucketRoutes) => {
                    bucketRoutes.forEach(br => {
                        assert.equal(br.route_id, routeId);
                        assert.ok(br.bucket_id > 0);
                    });

                    return getDbHandle().one('SELECT * FROM route_admin');
                })

                // route admin
                .then(ra => {
                    assert.equal(ra.user_id, routeFixture.userId);
                    assert.equal(ra.route_id, routeId);

                    return getDbHandle().many('SELECT * FROM vertices WHERE route_id = $1 order by id asc', [routeId]);
                })

                // vertices
                .then(vertices => {
                    const [v1, v2, v3] = vertices;
                    const [ev1, ev2, ev3] = routeFixture.vertices;

                    assert.equal(vertices.length, 3);
                    assert.equal(v1.title, ev1.title);
                    assert.equal(v2.title, ev2.title);
                    assert.equal(v3.title, ev3.title);
                    assert.equal(v1.description, ev1.description);
                    assert.equal(v2.description, ev2.description);
                    assert.equal(v3.description, ev3.description);
                    assert.deepEqual(v1.buckets, ev1.buckets);
                    assert.ok(!v2.buckets);
                    assert.ok(!v3.buckets);
                    assert.equal(v2.photo, ev2.photos[0].url);
                    assert.equal(v2.photo_source, ev2.photos[0].photoSource);

                    // vertice photos
                    return Promise.all(vertices.map((v, i) => {
                        return getDbHandle()
                            .manyOrNone('SELECT * FROM vertice_photos WHERE vertice_id = $1', v.id)
                            .then((photos) => {
                                if (i === 1) {
                                    assert.equal(photos.length, 1);
                                    assert.equal(photos[0].url, ev2.photos[0].url);
                                    assert.equal(photos[0].photo_source, ev2.photos[0].photoSource);
                                    assert.equal(photos[0].external_link, ev2.photos[0].externalLink);
                                    assert.equal(photos[0].username, ev2.photos[0].username);
                                } else {
                                    assert.ok(!photos.length);
                                }

                                return Promise.resolve();
                            })
                    }));
                });
            })
    ));
});
