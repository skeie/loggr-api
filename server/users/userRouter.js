const express = require('express');
const router = express.Router();
const Service = require('./userService');
const auth = require('../util/jwtToken');
const requireToken = auth.requireAuth();
const service = new Service();

const createUser = (req, res, next) => {
    service
        .createUser(req.body)
        .then(user => {
            res.json(user);
        })
        .catch(error => {
            console.log('error', error);

            res.sendStatus(400);
        });
};

const getUserById = (req, res, next) => {
    service
        .getUserById(req.user.id)
        .then(user => {
            res.json(user);
        })
        .catch(error => {
            console.log('error', error);

            res.sendStatus(400);
        });
};

router.post('/', createUser);
router.get('/', requireToken, getUserById);

const validate = (param, req) => {
    const errors = req.validationErrors();

    if (errors) {
        console.log({ what: param, error: JSON.stringify(errors) });
        return { ...errors };
    } else {
        return {};
    }
};

module.exports = router;
