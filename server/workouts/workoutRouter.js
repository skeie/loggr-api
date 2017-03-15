import express from "express";
const router = express.Router();
import Service from "./workoutService";
import { requireAuth } from "../util/jwtToken";
const requireToken = requireAuth();
const service = new Service();
import isEmpty from "lodash/isEmpty";
import { convertExerciseIdToInt } from '../util/util';

const createWorkout = (req, res, next) => {
  const errors = validate("exerciseid", req);
  if (!isEmpty(errors)) {
    res.send(400, errors);
  }
  service
    .createWorkout(req.params.exerciseId, req.user.id)
    .then(user => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log("error", error);
      res.sendStatus(400);
    });
};

const getCurrentWorkout = (req, res, next) => {
  const errors = validate("user", req);
  if (!isEmpty(errors)) {
    res.send(400, errors);
  }
  service
    .getCurrentWorkout(req.user.id)
    .then(workout => {
      res.json(workout || {});
    })
    .catch(error => {
      console.log("error", error);
      res.sendStatus(400);
    });
};

const updateCurrentWorkout = (req, res, next) => {
  const errors = validate("exerciseId", req);
  if (!isEmpty(errors)) {
    res.send(400, errors);
  }

  service
    .updateCurrentWorkout(req.params.exerciseId, req.user.id)
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      console.log("error", error);

      res.sendStatus(400);
    });
};

const deleteExerciseInWorkout = (req, res, next) => {
  const errors = validate("exerciseId", req);
  if (!isEmpty(errors)) {
    res.send(400, errors);
  }

  service
    .deleteExerciseInWorkout(req.params.exerciseId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(error => {
      console.log("error", error);

      res.sendStatus(400);
    });
};

router.post(
  "/:exerciseId",
  requireToken,
  convertExerciseIdToInt,
  createWorkout
);
router.get("/", requireToken, getCurrentWorkout);
router.put(
  "/:exerciseId",
  requireToken,
  convertExerciseIdToInt,
  updateCurrentWorkout
);
router.delete(
  "/:exerciseId",
  requireToken,
  convertExerciseIdToInt,
  deleteExerciseInWorkout
);

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
