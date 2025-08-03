import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const project = await Project.create({ name, members: [req.userId] });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.userId });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project.members.includes(req.userId)) {
      project.members.push(req.userId);
      await project.save();
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("members", "fullName avatar");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project.members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

