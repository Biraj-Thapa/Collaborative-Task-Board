"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import socket from "@/lib/socket";

const TaskPage = () => {
  const params = useParams();
  const projectId = params.id;
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchMembers();
    socket.emit("joinProject", projectId);

    socket.on("taskCreated", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [projectId]);

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:9000/api/task/${projectId}`, {
      withCredentials: true,
    });
    setTasks(res.data);
  };

  const fetchMembers = async () => {
    const res = await axios.get(
      `http://localhost:9000/api/projects/${projectId}/members`,
      { withCredentials: true }
    );
    setMembers(res.data);
  };
  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) return;
    const res = await axios.post(
      `http://localhost:9000/api/task/${projectId}`,
      { title, description, dueDate, assignedTo },
      { withCredentials: true }
    );
    socket.emit("taskCreated", projectId, res.data);
    setTasks((prev) => [...prev, res.data]);
    setTitle("");
    setDescription("");
    setDueDate("");
    setAssignedTo("");
  };

  const handleDelete = async (taskId) => {
    await axios.delete(`http://localhost:9000/api/task/${taskId}`, {
      withCredentials: true,
    });
    socket.emit("taskDeleted", projectId, taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const toggleComplete = async (task) => {
    const res = await axios.patch(
      `http://localhost:9000/api/task/${task._id}`,
      { status: task.status === "completed" ? "pending" : "completed" },
      { withCredentials: true }
    );
    socket.emit("taskUpdated", projectId, res.data);
    setTasks((prev) =>
      prev.map((t) => (t._id === res.data._id ? res.data : t))
    );
  };

  const handleReassign = async (taskId, newUserId) => {
    const res = await axios.patch(
      `http://localhost:9000/api/task/${taskId}`,
      { assignedTo: newUserId || null },
      { withCredentials: true }
    );
    socket.emit("taskUpdated", projectId, res.data);
    setTasks((prev) =>
      prev.map((t) => (t._id === res.data._id ? res.data : t))
    );
  };
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setEditAssignedTo(task.assignedTo?._id || "");
  };
  const handleEditTask = async (taskId) => {
    const res = await axios.patch(
      `http://localhost:9000/api/task/${taskId}`,
      {
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate,
        assignedTo: editAssignedTo || null,
      },
      { withCredentials: true }
    );
    socket.emit("taskUpdated", projectId, res.data);
    setTasks((prev) =>
      prev.map((t) => (t._id === res.data._id ? res.data : t))
    );
    setEditingTaskId(null);
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="">Assign to</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.fullName}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTask}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`bg-white p-4 rounded shadow mb-3 flex justify-between gap-4 ${
            task.status === "completed" ? "opacity-60 line-through" : ""
          }`}
        >
          <div className="flex-1">
            {editingTaskId === task._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border px-2 py-1 rounded mb-2"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border px-2 py-1 rounded mb-2"
                />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full border px-2 py-1 rounded mb-2"
                />
                <select
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  className="w-full border px-2 py-1 rounded mb-2"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.fullName}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleEditTask(task._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTaskId(null)}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm">{task.description}</p>
                <p className="text-xs text-gray-500">
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </p>
                <div className="text-xs text-gray-700 mt-1">
                  <label>Assigned to:</label>
                  <select
                    value={task.assignedTo?._id || task.assignedTo || ""}
                    onChange={(e) => handleReassign(task._id, e.target.value)}
                    className="ml-2 border px-1 py-0.5 rounded"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-1">
            <button
              onClick={() => toggleComplete(task)}
              className={`px-3 py-1 rounded text-white ${
                task.status === "completed" ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              {task.status === "completed" ? "Completed" : "Mark Done"}
            </button>
            <button
              onClick={() => startEditing(task)}
              className="text-blue-600 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default TaskPage;
