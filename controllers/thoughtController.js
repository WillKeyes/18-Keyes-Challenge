const Thought = require('../models/Thought');
const User = require('../models/User');

// Get all thoughts
exports.getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('reactions');
    res.json(thoughts);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get a single thought by ID
exports.getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id).populate('reactions');
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Create a new thought
exports.createThought = async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);
    // Add this thought to the user's thoughts array
    await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: newThought._id } });
    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Update a thought by ID
exports.updateThought = async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedThought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }
    res.json(updatedThought);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Delete a thought by ID
exports.deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndRemove(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }
    // Also remove this thought from the user's thoughts array
    await User.findByIdAndUpdate(thought.userId, { $pull: { thoughts: thought._id } });
    res.json({ message: 'Thought deleted!' });
  } catch (err) {
    res.status(500).send(err);
  }
};
