const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');

// Create project
router.post('/', auth, async (req, res) => {
  const { name, description, members } = req.body;
  try {
    // Ensure members are valid users
    const validMembers = await User.find({ _id: { $in: members || [] } });
    const project = new Project({
      name,
      description,
      members: validMembers.map(m => m._id),
      owner: req.user._id,
    });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get projects for user (where user is member or owner)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    }).populate('members', 'name email').populate('owner', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project (only owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    const { name, description, members } = req.body;
    if (name) project.name = name;
    if (description) project.description = description;
    if (members) {
      const validMembers = await User.find({ _id: { $in: members } });
      project.members = validMembers.map(m => m._id);
    }
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (only owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    await project.remove();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
