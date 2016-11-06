const express = require('express');
const CreateRouteController = require('./createRoute/CreateRouteController');

function apiV2 (app) {

    const router = express.Router(); // eslint-disable-line new-cap
    const createRouteController = new CreateRouteController({ app });

    router.post('/routes/postRoute', createRouteController.postRoute);

    return router;
}

module.exports = apiV2;
