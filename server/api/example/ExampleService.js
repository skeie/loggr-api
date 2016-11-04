const ExampleDAO = require('./ExampleDAO');
const logger = require('../../../libs/fruits-logger');
const bindAll = require('bindAll');

class ExampleService {

    constructor({ app }) {
        this.messageBus = app.locals.messageBus;
        this.exampleDAO = new ExampleDAO({ app });
        bindAll(this, 'getExamples');
    }

    /**
     * @param  {ExampleModel} example
     */
    getExamples(example) {

        return this.exampleDAO.getExamples(example)
        .catch((err) => {
            logger.info('Failed to get examples: ', err, example);
            throw err;
        });
    }
}

module.exports = ExampleService;
