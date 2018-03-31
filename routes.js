"use strict";

const express = require("express");
const router = express.Router();
const Question = require("./models").Question;

router.param("qID", function(req, res, next, id) {
  Question.findById(id, function(err, doc) {
    if (err) return next(err);
    if (!doc) {
      err = new Error("Not found");
      err.status = 404;
      return next(err);
    }
    req.question = doc;
    return next();
  });
});

router.param("aID", function(req, res, next, id) {
  req.answer = req.question.answers.id(id);
  if (!req.answer) {
    err = new Error("Not found");
    err.status = 404;
    return next(err);
  }
  next();
});

// GET /questions
// route for questions collection
router.get("/", (req, res, next) => {
  Question.find({})
    .sort({ createdAt: -1 })
    .exec(function(err, questions) {
      if (err) return next(err);
      res.json(questions);
    });
});
// it could also begin like this:
// Question.find({}, null, { sort: { createdAt: -1 } }, function(

// POST /questions
// route for creating questions
router.post("/", (req, res, next) => {
  const question = new Question(req.body);
  question.save(function(err, question) {
    if (err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// GET /questions/:qID
// route for specific questions
router.get("/:qID", (req, res, next) => {
  res.json(req.question);
});

// POST /questions/qID/answers
// route for creating an answer
router.post("/:qID/answers", (req, res, next) => {
  req.question.answers.push(req.body);
  req.question.save(function(err, question) {
    if (err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// PUT /questions/qID/answers/:aID
// edit a specific answer
router.put("/:qID/answers/:aID", (req, res) => {
  req.answer.update(req.body, function(err, result) {
    if (err) return next(err);
    res.json(result);
  });
});

// DELETE /questions/qID/answers/:aID
// delete a specific answer
router.delete("/:qID/answers/:aID", (req, res) => {
  req.answer.remove(function(err) {
    req.question.save(function(err, question) {
      if (err) return next(err);
      res.json(question);
    });
  });
});

// POST /questions/qID/answers/:aID
// vote on a specific answer
router.post(
  "/:qID/answers/:aID/vote-:dir",
  (req, res, next) => {
    if (req.params.dir.search(/^(up|down)$/) === -1) {
      const err = new Error("not found");
      err.status = 404;
      next(err);
    } else {
      req.vote = req.params.dir;
      next();
    }
  },
  (req, res, next) => {
    console.log(req.vote);
    req.answer.vote(req.vote, function(err, question) {
      if (err) return next(err);
      res.json(question);
    });
  }
);

module.exports = router;
