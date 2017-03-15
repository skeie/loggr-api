import express from "express";
const router = express.Router();
import Service from "./highscoreService";
const service = new Service();
import { requireAuth } from "../util/jwtToken";
const requireToken = requireAuth();
import isEmpty from 'lodash/isEmpty';

const getAll = (req, res, next) => {
  const errors = validate("user", req);
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

router.get("/", requireToken, getAll);

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
