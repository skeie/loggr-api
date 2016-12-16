const logger = require('../../../libs/fruits-logger');
const CreateRouteService = require('./CreateRouteService');
const bindAll = require('lodash.bindall');

// if you want to test this endpoint
// const tempRoute = require('./testFixtures');



class CreateRouteController {

    constructor({ app }) {
        this.createRouteService = new CreateRouteService({ app });
        bindAll(this, 'postRoute');
    }

    async postRoute(req, res, next) {
        const { route } = req.body;

        req.check(['route', 'title'], 'title must be included').len(3).notEmpty();
        req.check(['route', 'userId'], 'user id must be included').isInt().notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            logger.info('Create route validation errors', null, {extras: errors})
            return res.status(400).json(errors);
        }

        try {
            const id = await this.createRouteService.postRoute(route);
            logger.info(`Route created! ${id}`);
            res.status(201).json({ id });

        } catch(err) {
            logger.info('Failed to create route', err);
            res.status(400).json(err);
        }
    }
}

module.exports = CreateRouteController;
