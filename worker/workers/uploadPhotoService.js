const formidable = require('formidable');
const Promise = require('bluebird');
const logger = require('../../libs/fruits-logger');
const path = require('path');
const uuid = require('uuid');
import * as jwt from '../../lib/jwt';
import fs from 'fs';
import request from 'request';
import config from '../../config';

const backendToken = createJwtBackendToken();

const isError = (err, httpResponse) => {
    return err || httpResponse.statusCode >= 400;
};


function createJwtBackendToken () {
    const id = config.backendToken.id;
    const password = config.backendToken.password;
    const mail = config.backendToken.mail;
    return jwt.generateToken(mail, id, password, {neveExpire: true});
}



/**
* @param {id} vertice id, route id etc..
* @param {fileCat} type of photo (user/banner/vertice) used in naming the file
*/
function uploadPhtoService (id, fileCat, req) {

    return new Promise (function (resolve, reject) {

        const form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, file) {

            if (err) { return reject(err);}

            if (file.photo_upload) {


                // var fileUrl = file.photo_upload.path;
                var filetype = path.extname(file.photo_upload.name);
                var filename = id;

                filename += fileCat;
                filename += uuid.v1();
                filename += filetype;

                logger.info({what : 'Uploading file', filename: filename,
                    contentType : file.photo_upload.type, size: file.photo_upload.size});

                const url = config.imageServerURI + '/api/images';
                const filenameOnDisk = file.photo_upload.path;

                let formData = {
                    routesImage : fs.createReadStream(filenameOnDisk),
                    filename: filename
                };

                request.post({
                    url: url,
                    headers: {
                        accept: 'application/json'
                    },
                    json: true,
                    formData: formData,
                    auth: {
                        'bearer': backendToken
                    }

                }, (error, response, body) => {

                    // fire and forget.. TODO clean up in a separate job
                    fs.unlink(filenameOnDisk, () => {});

                    if (isError(error, response)) {
                        logger.warn({what: 'Failed to upload image', error});
                        return reject(error);
                    }

                    if (isError(error, response)) {
                        logger.warn('Upload service failed ', filenameOnDisk);
                        reject({message: 'Failed to upload image'});

                    } else {
                        logger.info('info', 'Upload service stored image with url: ', body);
                        return resolve(body);
                    }
                });


            } else {
                logger.info({type : 'info', what : 'Upload file - but no file'});
                resolve();
            }
        });

        form.on('error', function (err) {
            logger.warn('fileupload form parse failed', err);
            reject(err);
        });
    });
}

function createRouteCard (images, routeId) {
    return new Promise((resolve, reject) => {
        request.post({
            url: config.imageServerURI + '/api/images/create-card',
            json: {
                images,
                routeId
            },
            auth: {
                'bearer': backendToken
            }
        }, (err, httpResponse, body) => {
            if (!isError(err, httpResponse)) {
                resolve({
                    labeledImage: body.labeledImage,
                    normalImage: body.normalImage,
                    labeledImageURI: `${body.labeledImage}`,
                    normalImageURI: `${body.normalImage}`
                });
            } else {
                logger.info('Failed to createRouteCard', body, err);
                reject(err);
            }
        });
    });
}

function deleteCardImages (images) {
    return new Promise((resolve, reject) => {
        request.post({
            url: config.imageServerURI + '/api/images/delete-images',
            json: {
                images
            },
            auth: {
                'bearer': backendToken
            }
        }, (err, httpResponse, body) => {
            if (!isError(err, httpResponse)) {
                resolve(body);
            } else {
                logger.info('Failed to deleteCardImages', body);
                reject(err);
            }
        })
    });
}

function deleteS3Image (imageURI) {
    logger.debug('Deleting s3 image', imageURI);
    return new Promise((resolve, reject) => {
        request.del({
            url: config.imageServerURI + '/api/images/',
            json: {imageURI},
            auth: {
                'bearer': backendToken
            }
        }, (err, httpResponse, body) => {
            if (isError(err, httpResponse)) {
                logger.info('Failed to deleteS3Image', body);
                reject(err);
            } else {
                resolve(body);
            }
        })
    });
}

function createMapImage (routeId) {
    logger.info('Creating map image ', routeId);

    return new Promise((resolve, reject) => {
        const uri = `${config.imageServerURI}/api/images/create-map-img?routeId=${routeId}`;
        request.post({
            url: uri,
            json: {uri},
            auth: {
                'bearer': backendToken
            }
        }, (err, httpResponse, body) => {
            if (isError(err, httpResponse)) {
                logger.info('Failed to createMapImage', body);
                reject(err);
            } else {
                logger.debug('created map image', body);
                resolve(body);
            }
        });
    });
}

module.exports = {
    uploadPhoto: uploadPhtoService,
    createRouteCard,
    deleteCardImages,
    deleteS3Image,
    createMapImage,
    createJwtBackendToken
};
