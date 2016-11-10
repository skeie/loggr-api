import {createMapImage} from './uploadPhotoService';
const logger = require('../../libs/fruits-logger');
import Promise from 'bluebird';

function takeMapShot (id) {
    return new Promise((resolve, reject) => {

        createMapImage(id)
        .then((result) => {
            if (result) {
                return updateRoute(id, {
                    mapPhoto: result
                });
            } else {
                logger.warn('Take shot - createMapImage returned empty image');
                return reject({message: 'CreateMapImage returned empty image'});
            }
        })
        .then(resolve)
        .catch(reject);
    });
}


export default takeMapShot;
