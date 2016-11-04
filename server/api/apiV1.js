const express = require('express');
const ExampleController = require('./example/ExampleController');

function apiV1 (app) {

    const router = express.Router(); // eslint-disable-line new-cap
    const exampleController = new ExampleController({ app });


    router.post('/examples', exampleController.getExamples);

    return router;
}

module.exports = apiV1;