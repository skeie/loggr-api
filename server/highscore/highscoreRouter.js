const express = require('express');
const router = express.Router();
const Service = require('./highscoreService');
const service = new Service();
const auth = require('../util/jwtToken');
const requireToken = auth.requireAuth();
const isEmpty = require('lodash/isEmpty');

const getAll = (req, res, next) => {
    const errors = validate('user', req);
    if (!isEmpty(errors)) {
        res.send(400, errors);
    }

    service
        .getAll(req.user.id)
        .then(data => {
            res.json(data);
        })
        .catch(() => {
            res.sendStatus(400);
        });
};

router.get('/', requireToken, getAll);

function validate(param, req) {
    const errors = req.validationErrors();

    if (errors) {
        console.log({ what: param, error: JSON.stringify(errors) });
        return { ...errors };
    } else {
        return {};
    }
}

module.exports = router;
