const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// Middleware to check if user is member of project
const checkProjectMember = async (req, res, next) => {
  const projectId = req.body.project || req.params.projectId || req.params.id;
  if (!projectId) return res.status(400).json({ message: 'Project ID required' });

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const isMember = project.owner.equals(req.user._id) || project.members.includes(req.user._id);
  if (!isMember) return res.status(403).json({ message: 'Not authorized' });

  req.project = project;
  next();
};

// Create task
router.post('/', auth, checkProjectMember, async (req, res) => {
  const { project, title, description, assignee, dueDate, status } = req.body;
  try {
    // Validate assignee is member of project
    if (assignee) {
      const isMember = req.project.owner.equals(assignee) || req.project.members.includes(assignee);
      if (!isMember) return res.status(400).json({ message: 'Assignee must be a project member' });
    }

    const task = new Task({
      project,
      title,
      description,
      assignee,
      dueDate,
      status,
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks by project
router.get('/project/:projectId', auth, checkProjectMember, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee', 'name email')
      .sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = task.project;
    const isMember = project.owner.equals(req.user._id) || project.members.includes(req.user._id);
    if (!isMember) return res.status(403).json({ message: 'Not authorized' });

    const { title, description, assignee, dueDate, status } = req.body;

    if (assignee) {
      const isAssigneeMember = project.owner.equals(assignee) || project.members.includes(assignee);
      if (!isAssigneeMember) return res.status(400).json({ message: 'Assignee must be a project member' });
      task.assignee = assignee;
    }
    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = task.project;
    const isMember = project.owner.equals(req.user._id) || project.members.includes(req.user._id);
    if (!isMember) return res.status(403).json({ message: 'Not authorized' });

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
