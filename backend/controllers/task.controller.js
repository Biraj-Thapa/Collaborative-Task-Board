import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendMail.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      project: req.params.projectId,
    });

    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: "Task Assignment",
          text: `
    You have been assigned a new task:
    Title: ${task.title}
    Description: ${task.description}
    Due Date: ${new Date(task.dueDate).toLocaleString()}
  `,
        });
      }
    }
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate(
      "assignedTo",
      "fullName email"
    );
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
    });
    if (
      req.body.assignedTo &&
      req.body.assignedTo !== task.assignedTo?.toString()
    ) {
      const user = await User.findById(req.body.assignedTo);
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: "Task Reassignment",
          text: `You have been reassigned a task: ${task.title}.
           Description: ${task.description}
           Due Date: ${new Date(task.dueDate).toLocaleString()}`,
        });
      }
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
