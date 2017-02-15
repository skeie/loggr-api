import express from "express";
const router = express.Router();
import Service from "./userService";

const service = new Service();


const createUser = (req, res, next) => {

  service
    .createUser(req.body)
    .then((user) => {      
      res.json(user);
    })
    .catch(error => {
      console.log("error", error);

      res.sendStatus(400);
    });
};

router.post("/", createUser);


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
