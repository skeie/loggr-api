const bindAll = require('lodash.bindall');
const NewRouteCommand = require('./NewRouteCommand');
const Notifications = require('./Notifications');
const EmailClient = require('./EmailClient');

class NotifyWorker {

    constructor ({ config, dbHandler }) {
        this.emailClient = new EmailClient({ config });
        this.dbHandler = dbHandler;
        bindAll(this, 'notify')
    }

    notify (job) {
        let command;
        switch (job.command) {

            case Notifications.NEW_ROUTE:
                command = new NewRouteCommand({
                    emailClient: this.emailClient,
                    dbHandler: this.dbHandler,
                });
                break;

            default:
                throw new Error('Illegal command', job.command);

        }
        return command.execute(job);
    }
}

module.exports = NotifyWorker;
