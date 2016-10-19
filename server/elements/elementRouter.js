import express from 'express';
const router = express.Router();
import Service from './elementService';
const service = new Service();
import {isEmpty} from 'lodash';

const postElement = (req, res, next) => {
  const errors = validate('element', req);
  if (!isEmpty(errors)) {
    res.send(400, errors);
  }

  service.postElement(req.body.element, req.params.exerciseId)
        .then(() => {
          res.sendStatus(201);
        }).catch(() => {
          res.sendStatus(400);
        });
};

const updateElement = (req, res, next) => {
  const errors = validate('element', req);
  if (!isEmpty(errors)) {
    res.send(400, errors);
  }

  const table = 'elements';
  service.update(req.params.id, req.body.element, table)
        .then(() => {
          res.sendStatus(201);
        }).catch(() => {
          res.sendStatus(400);
        });
};

router.put('/:exerciseId/:id', updateElement);
router.post('/:exerciseId/element', postElement);

function validate(param, req) {
  const errors = req.validationErrors();

  if (errors) {
    console.log({what: param, error: JSON.stringify(errors)});
    return {...errors};
  } else {
    return {};
  }
}

module.exports = router;
