const express = require('express');
const router = express.Router();
const Multer = require('multer');
const imgUpload = require('../util/imgUpload');
const service = require('./imageService');
const Service = new service();
const jwtToken = require('../util/jwtToken');
const requireToken = jwtToken.requireAuth();

// Handles the multipart/form-data
// Adds a .file key to the request object
// the 'storage' key saves the image temporarily for in memory
// You can also pass a file path on your server and it will save the image there
const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024,
});

// Service.setImageSeen(24, 7);

router.get('/unSeen', requireToken, async (req, response) => {
    try {
        const unSeenImgs = await Service.getUnSeenImage(req.user.id);
        response.json(unSeenImgs);
    } catch (error) {
        console.log('error in unseen router', error);

        response.sendStatus(400);
    }
});

router.put('/unSeen/:imageId/decline', requireToken, async (req, response) => {
    try {
        Service.setImageDecline(req.params.imageId, req.user.id);
        response.sendStatus(201);
    } catch (error) {
        console.log(
            'error in unseen/imageid router',
            error,
            req.params.imageId,
        );

        response.sendStatus(400);
    }
});

router.put('/unSeen/:imageId', requireToken, async (req, response) => {
    try {
        const res = await Service.setImageSeen(req.params.imageId, req.user.id);
        response.json(res);
    } catch (error) {
        console.log(
            'error in unseen/imageid router',
            error,
            req.params.imageId,
        );

        response.sendStatus(400);
    }
});

// the multer accessing the key 'image', as defined in the `FormData` object on the front end
// Passing the uploadToGcs function as middleware to handle the uploading of request.file
router.post(
    '/',
    requireToken,
    multer.single('image'),
    imgUpload.uploadToGcs,
    function(request, response, next) {
        if (request.file && request.file.cloudStoragePublicUrl) {
            Service.postImageUrl(
                request.file.cloudStoragePublicUrl,
                request.user.id,
            );
            response.sendStatus(201);
        } else {
            response.sendStatus(400);
        }
    },
);

module.exports = router;
