const Promise = require('bluebird');
const bindAll = require('lodash.bindall');
// TODO: swich with brakes
const request = require('good-guy-http');
const logger = require('../../libs/fruits-logger');
const jwt = require('../../libs/jwt');

const backendTokenConfig = {
    mail: 'team@routes.guide',
    id: '8076ca9f-29c6-4854-9cdd-15fccc4fb6e1',
    password: '1ef6285c-74cb-4233-9e76-f305f2de4498'
};

const backendToken = createJwtBackendToken();

function createJwtBackendToken () {
    const id = backendTokenConfig.id;
    const password = backendTokenConfig.password;
    const mail = backendTokenConfig.mail;
    return jwt.generateToken(mail, id, password, { neveExpire: true });
}

class UploadPhotoClient {

    constructor ({ config, dbHandler }) {
        this.dbHandler = dbHandler;
        this.config = config;

        this.request = request({

            // take map shots might take lots of time
            timeout: 12000,
            postprocess: false,
        });

        bindAll(this, 'createMapImage');
    }

    createMapImage (routeId) {
        logger.info('Creating map image ', routeId);

        return new Promise((resolve, reject) => {
            const url = `${this.config.IMAGE_SERVICE_URI}/api/images/create-map-img?routeId=${routeId}`;
            this.request({
                method: 'post',
                url,
                auth: {
                    'bearer': backendToken
                }
            })
                .then((res) => {
                    logger.debug(`Took screenshot ${res.body}`);
                    return resolve(res.body);
                })
                .catch((err) => {
                    logger.error('Failed to createMapImage', err);
                    reject(err);
                });
        });
    }
}

module.exports = UploadPhotoClient;
