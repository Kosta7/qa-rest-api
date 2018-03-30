"use strict";

const express = require("express");
const router = express.Router();

// GET /questions
// route for questions collection
router.get("/", (req, res) => {
  res.json({ response: "you sent me a GET request" });
});

// POST /questions
// route for creating questions
router.post("/", (req, res) => {
  res.json({
    response: "you sent me a POST request",
    body: req.body
  });
});

// GET /questions/:qID
// route for specific questions
router.get("/:qID", (req, res) => {
  res.json({ response: "you sent me a GET request for " + req.params.qID });
});

// POST /questions/qID/answers
// route for creating an answer
router.post("/:qID/answers", (req, res) => {
  res.json({
    response: "you sent me a POST request to /answers",
    questionId: req.params.qID,
    body: req.body
  });
});

// PUT /questions/qID/answers/:aID
// edit a specific answer
router.put("/:qID/answers/:aID", (req, res) => {
  res.json({
    response: "you sent me a PUT request to /answers",
    questionId: req.params.qID,
    answerId: req.params.aID,
    body: req.body
  });
});

// DELETE /questions/qID/answers/:aID
// delete a specific answer
router.delete("/:qID/answers/:aID", (req, res) => {
  res.json({
    response: "you sent me a DELETE request to /answers",
    questionId: req.params.qID,
    answerId: req.params.aID
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
      next();
    }
  },
  (req, res) => {
    res.json({
      response: "you sent me a POST request to /vote-" + req.params.dir,
      questionId: req.params.qID,
      answerId: req.params.aID,
      vote: req.params.dir
    });
  }
);

module.exports = router;
