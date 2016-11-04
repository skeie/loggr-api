const logger = require('../../../libs/fruits-logger');
const ExampleService = require('./ExampleService');
const Example = require('./ExampleModel');
const bindAll = require('lodash.bindall');


class ExampleController {

    constructor({ app }) {
        this.exampleService = new ExampleService({ app });
        bindAll(this, 'getExamples');
    }

    getExamples(req, res, next) {
        const data = req.body;

        req.check('city', 'city must be included').len(3).notEmpty();
        req.check('userId', 'user id must be included').isInt().notEmpty();

        
        const errors = req.validationErrors();
        if (errors) {
            return next({ status: 401, message: errors }); 
        }

        const example = new Example(data);

        return this.exampleService.fetchEamples(example)
            .then((result) => res.status(200).json(result))
            .catch((err) => next(err));
    }
}

module.exports = ExampleController;
