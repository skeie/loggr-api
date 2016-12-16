const bindAll = require('lodash.bindall');
const Notifications = require('./Notifications');
const logger = require('../../libs/fruits-logger');
const { ROUTE_ID_SUBS } = require('./sendGridSubs');

const GET_USER = `SELECT * FROM users u LEFT JOIN route_admin ra ON u.id = ra.user_id WHERE ra.route_id = $1`;

class NewRouteCommand {

    constructor ({ emailClient, dbHandler }) {
        this.emailClient = emailClient;
        this.dbHandler = dbHandler;
        bindAll(this, 'execute');
    }

    execute ({ routeId, command }) {
        if (!routeId) {
            return Promise.reject('routeId must be included in NewRouteCommand');
        }

        return this.dbHandler.one(GET_USER, [routeId])
        .then(user => {
            // notificationType is used to know which mail templete to use
            const mailOpts = {
                to: user.mail,
                command,
                mail: user.mail,
                subject: 'High five - Your route is done!',
                fromName: 'Routes Guide',
                subs: {
                    [ROUTE_ID_SUBS]: routeId,
                },
            };
            
            const notificationType = Notifications.NEW_ROUTE;

            return this.emailClient.sendGridMail(mailOpts, notificationType);
        })
        .catch((err) => {
            logger.warn(`Failed to send new route email. routeId: ${routeId}`, err);
            throw err;
        });
    }

}

module.exports = NewRouteCommand;
