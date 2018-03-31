"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sortAnswers = function(a, b) {
  // - : a before b
  // 0 : no change
  // + : a after b

  if (a.votes === b.votes) return b.updatedAt - a.updatedAt;
  return b.votes - a.votes;
};

const AnswerSchema = new Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 }
});

// identical:
// AnswerSchema.method("update", function(updates, callback) {});
AnswerSchema.methods.update = function(updates, callback) {
  Object.assign(this, updates, { updatedAt: new Date() });
  this.parent().save(callback);
};

AnswerSchema.methods.vote = function(vote, callback) {
  if (vote === "up") this.votes++;
  else this.votes--;
  this.parent().save(callback);
};

const QuestionSchema = new Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  answers: [AnswerSchema]
});

QuestionSchema.pre("save", function(next) {
  this.answers.sort(sortAnswers);
  next();
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;
