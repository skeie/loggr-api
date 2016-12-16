const Promise = require('bluebird');
const sendGrid = require('sendgrid');
const bindAll = require('lodash.bindall');
const Notifications = require('./Notifications');
const logger = require('../../libs/fruits-logger');

const SEND_GRID_TOKEN = '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';
const TEAM_EMAIL = 'routesteam@gmail.com';
const OUR_MAIL = 'team@routes.guide';
const CEO_MAIL = 'truls@routes.guide';


const sendGridTemplateTokens = {
    createdNewRoute: '8ce208a0-d726-476a-84af-03dd08fb0bb6',
};

function getTemplate (command) {
    switch (command) {
        case Notifications.NEW_ROUTE:
            return sendGridTemplateTokens.createdNewRoute;

        default:
            throw new Error({ message: 'Not valid command in getTemplate', command });

    }
}


class EmailClient {

    constructor ({ config }) {
        this.config = config;
        this.sendgridClient = sendGrid(SEND_GRID_TOKEN);

        bindAll(this, 'sendGridMail');
    }

    /**
     * @param  {Object} opts has to have:
     *   to - the one
     *   from - if not provided team@routes.guide
     *   text - the body of the
     *   subject - the email subject
     **/
    sendGridMail (opts) {
        return new Promise((resolve, reject) => {
            if (process.env.NODE_ENV === 'production') {

                if (!opts.to) {
                    throw new Error('Need to specify "to" in opts in sendGridMail()');
                }

                const text = 'This value is required';
                const html = 'This value is required';

                let email = new this.sendgridClient.Email({
                    to: opts.to,
                    from: opts.from || OUR_MAIL,
                    replyto: opts.from || OUR_MAIL,
                    subject: opts.subject,
                    text: text,
                    html: html,
                    fromname: opts.fromName || 'Routes.guide'
                });

                if (opts.sendAt) {
                    // Specify the time to send the mail
                    logger.info(`Adding sendAt: '${opts.sendAt}'`);
                    email.setSendAt(opts.sendAt);
                }

                // inserting substitution tags in the email template
                const keys = Object.keys(opts.subs);
                keys.forEach((key) => {
                    email.addSubstitution(key, opts.subs[key]);
                });
                // adding the email template
                email.setFilters({
                    'templates': {
                        'settings': {
                            'enable': '1',
                            'template_id': getTemplate(opts.command)
                        }
                    }
                });

                this.sendgridClient.send(email, (err, result) => {
                    if (err) {
                        logger.warn('Error sending mail', err, email);
                        reject(err);
                    } else {
                        logger.info('Sending mail ok', email);
                        resolve(result);
                    }
                });
            } else {
                logger.debug('Sending out sendgrid email with opts', opts);
                resolve();
            }
        });
    }
}

module.exports = EmailClient;