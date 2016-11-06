const logger = require('../../../libs/fruits-logger');
const CreateRouteService = require('./CreateRouteService');
// const Example = require('./ExampleModel');
const bindAll = require('lodash.bindall');



class CreateRouteController {

    constructor({ app }) {
        this.CreateRouteService = new CreateRouteService({ app });
        bindAll(this, 'postRoute');
    }

    ping (req, res, next) {
        console.log('yolo 1338');

        res.status(200).json({sap: 'sap'});
    }

    postRoute(req, res, next) {
        const { route } = req.body;

        //req.check('city', 'city must be included').len(3).notEmpty();
        //req.check('userId', 'user id must be included').isInt().notEmpty();


        // const errors = req.validationErrors();
        // if (errors) {
        //     return next({ status: 401, message: errors });
        // }

        // const example = new Example(data);

         return this.CreateRouteService.postRoute(route)
             .then((result) => {
                 console.log('result', result);

                 res.status(200).json(result);
             })
             .catch((err) => next(err));
    }
}

module.exports = CreateRouteController;
