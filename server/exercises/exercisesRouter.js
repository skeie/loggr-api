import express from "express";
const router = express.Router();
import Service from "./exercisesService";
import { isEmpty } from "lodash";
const service = new Service();

const findOne = (req, res, next) => {
  service.getOne(req.params.id).then(data => {
    res.json({ data });
  });
};

const postOne = (req, res, next) => {
  const errors = validate("exercise", req);
  if (!isEmpty(errors)) {
    res.send(400, errors);
  }

  service
    .postOne(req.body.exercise, req.params.userId)
    .then(newExercise => {
      res.json(newExercise);
    })
    .catch(() => {
      res.sendStatus(400);
    });
};

const updateExercise = (req, res, next) => {
  const errors = validate("exercise", req);
  if (!isEmpty(errors)) {
    res.send(400, errors);
  }

  const table = "exercises";
  service
    .update(req.params.id, req.body.exercise, table)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.sendStatus(400);
    });
};

const deleteExercise = (req, res, next) => {
  const table = "exercises";
  service
    .delete(req.params.id, table)
    .then(() => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log("error", error);

      res.sendStatus(400);
    });
};

const getAll = (req, res, next) => {
  console.log('kommer du hit?');
  
  const { userId } = req.params;
  service
    .getAll(userId)
    .then(data => {
      res.json({ data });
    })
    .catch(error => {
      res.sendStatus(400);
    });
};

// router.put('/:id/:index', updateExercise);
router.delete("/:id", deleteExercise);
router.get("/:userId", getAll);
// router.get("/one/:id", findOne);
router.post("/:userId", postOne);
router.put("/:id", updateExercise);

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
