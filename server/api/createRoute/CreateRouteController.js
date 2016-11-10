const logger = require('../../../libs/fruits-logger');
const CreateRouteService = require('./CreateRouteService');
// const Example = require('./ExampleModel');
const bindAll = require('lodash.bindall');



class CreateRouteController {

    constructor({ app }) {
        this.createRouteService = new CreateRouteService({ app });
        bindAll(this, 'postRoute');
    }

    async postRoute(req, res, next) {
        const { route } = req.body;

        //req.check('city', 'city must be included').len(3).notEmpty();
        //req.check('userId', 'user id must be included').isInt().notEmpty();


        // const errors = req.validationErrors();
        // if (errors) {
        //     return next({ status: 401, message: errors });
        // }

        const tempRoute = require('./testFixtures');

        try {
            const id = await this.createRouteService.postRoute(tempRoute);
            res.status(200).json({ id });

        } catch(err) {
            logger.info('Failed to create route', result);
            res.status(401).send(result);
        }
         
            //  .then((result) => {
            //      res.status(200).json(result);
            //  })
            //  .catch((err) => next(err));
    }
}

module.exports = CreateRouteController;
