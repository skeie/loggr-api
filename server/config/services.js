'use strict';

const { str } = require('envalid');

// TODO: dont do this logic here, configure
// the way its supposed to with config-loader


const imageServerURI = process.env.ROUTESIMAGEAPI_PORT_8001_TCP_ADDR ?
    `http://${process.env.ROUTESIMAGEAPI_PORT_8001_TCP_ADDR}:${process.env.ROUTESIMAGEAPI_PORT_8001_TCP_PORT}`
    :
    'http://localhost:8001';

const socialServerURI = process.env.ROUTESSOCIALAPI_PORT_8002_TCP_ADDR ? 
    `http://${process.env.ROUTESSOCIALAPI_PORT_8002_TCP_ADDR}:${process.env.ROUTESSOCIALAPI_PORT_8002_TCP_PORT}`
    :
    'http://localhost:8002';


module.exports = {
    IMAGE_SERVICE_URI: str({
        desc: 'routes-image-api connection uri',
        default: imageServerURI,
    }),

    SOCIAL_SERVICE_URI: str({
        desc: 'routes-social-api connection uri',
        default: socialServerURI,
    })
};
