const Promise = require('bluebird');
const path = require('path');
const uuid = require('uuid');
const logger = require('../../libs/fruits-logger');
const jwt = require('../../libs/jwt');

// TODO: fix URI
const imageServerURI = 'http://localhost:8003';

// TODO: swich with brakes
const request = require('good-guy-http')({
    timeout: 10000,
    postprocess: false
});

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

function createMapImage (routeId) {
    logger.info('Creating map image ', routeId);

    return new Promise((resolve, reject) => {
        const url = `${imageServerURI}/api/images/create-map-img?routeId=${routeId}`;
        request({
            method: 'post',
            url,
            auth: {
                'bearer': backendToken
            }
        })
        .then((res) => {
            return res.body;
        })
        .catch((err) => {
            logger.warn('Failed to createMapImage', err);
            reject(err);
        });
    });
}

module.exports = {
    createMapImage,
    createJwtBackendToken
};
