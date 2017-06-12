const storage = require('@google-cloud/storage');
const fs = require('fs');
var Jimp = require('jimp');

const gcs = storage({
    projectId: 'zyada-69551',
    keyFilename: './server/util/keyfile.json',
});

const bucketName = 'zyada-69551-image';
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload = {};

ImgUpload.uploadToGcs = async (req, res, next) => {
    if (!req.file) return next();
    let name = 'zyada' + '-' + Date.now() + '.jpg';

    // req.file.cloudStorageObject = name;
    // req.file.cloudStoragePublicUrl = getPublicUrl(name);
    // next();
    return;
    try {
        const readImg = await Jimp.read(req.file.buffer);
        const compressedImg = readImg
            .resize(500, 500) // resize
            .quality(60) // set JPEG quality
            .write(name); // save
    } catch (err) {
        console.error(err);
    }

    // Can optionally add a path to the gcsname below by concatenating it before the filename
    // const gcsname = req.file.originalname;
    const file = bucket.file(name);
    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });
    stream.on('error', err => {
        req.file.cloudStorageError = err;
        next(err);
    });
    stream.on('finish', () => {
        req.file.cloudStorageObject = name;
        req.file.cloudStoragePublicUrl = getPublicUrl(name);
        next();
    });

    stream.end(req.file.buffer);
    fs.unlink(name);
};

module.exports = ImgUpload;
