const assert = require('power-assert');
const repairVerticeSortorder = require('./repairVerticeSortorder');
const routeFixture = require('./testFixtures');

describe('repair vertice sortorder', () => {
    it('should return the same, if order is correct', () => {

        const route = routeFixture;
        const res = repairVerticeSortorder(Object.assign([], route.vertices));
        const [v1, v2, v3] = res;

        assert.equal(v1.sortorder, 1);
        assert.equal(v2.sortorder, 2);
        assert.equal(v3.sortorder, 3);
    });

    it('should correct order', () => {

        const verts = [
            {id: 'second', sortorder: 2},
            {id: 'third', sortorder: 3},
            {id: 'first', sortorder: 1}
        ];

        const res = repairVerticeSortorder(verts);
        const [v1, v2, v3] = res;
        assert.equal(v1.sortorder, 1);
        assert.equal(v2.sortorder, 2);
        assert.equal(v3.sortorder, 3);

        assert.equal(v1.id, 'first');
        assert.equal(v2.id, 'second');
        assert.equal(v3.id, 'third');
    });

    it('should correct equal values', () => {

        const verts = [
            {id: 'first', sortorder: 1},
            {id: 'second', sortorder: 2},
            {id: 'third', sortorder: 3},
            {id: 'fourth', sortorder: 3}
        ];

        const [v1, v2, v3, v4] = repairVerticeSortorder(verts);
        assert.equal(v1.sortorder, 1);
        assert.equal(v2.sortorder, 2);
        assert.equal(v3.sortorder, 3);
        assert.equal(v4.sortorder, 4);

        assert.equal(v1.id, 'first');
        assert.equal(v2.id, 'second');
        assert.equal(v3.id, 'third');
        assert.equal(v4.id, 'fourth');
    });

    it('should fix a totally broken list', () => {

        const verts = [
            {id: 'first', sortorder: 1},
            {id: 'second', sortorder: 2},
            {id: 'third', sortorder: 3},
            {id: 'fifth', sortorder: 1},
            {id: 'fourth', sortorder: 3}
        ];

        const res = repairVerticeSortorder(verts);
        const [v1, v2, v3, v4, v5] = res;

        assert.equal(v1.sortorder, 1);
        assert.equal(v2.sortorder, 2);
        assert.equal(v3.sortorder, 3);
        assert.equal(v4.sortorder, 4);
        assert.equal(v5.sortorder, 5);

        assert.equal(v1.id, 'first');
        assert.equal(v2.id, 'fifth');
        assert.equal(v3.id, 'second');
        assert.equal(v4.id, 'third');
        assert.equal(v5.id, 'fourth');
    });
});