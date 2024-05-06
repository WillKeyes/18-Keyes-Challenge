const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => createdAtVal.toDateString()
  }
}, {
  toJSON: {
    getters: true
  },
  id: false
});

const ThoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => createdAtVal.toDateString()
  },
  username: { 
    type: String,
    required: true
  },
  reactions: [ReactionSchema]
}, {
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false
});

ThoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = mongoose.model('Thought', ThoughtSchema);

module.exports = Thought;
