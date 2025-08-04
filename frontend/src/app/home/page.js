"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { login } from "@/redux/reducerSlice/userSlice";
import Link from "next/link";

const HomePage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [joinId, setJoinId] = useState("");

  useEffect(() => {
    if (!currentUser) {
      axios
        .get("http://localhost:9000/api/me", { withCredentials: true })
        .then((res) => {
          dispatch(login(res.data));
        })
        .catch((err) => {
          console.error("User fetch failed:", err.response?.data?.message);
        });
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/projects", {
        withCredentials: true,
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    try {
      await axios.post(
        "http://localhost:9000/api/projects",
        { name: projectName },
        { withCredentials: true }
      );
      setProjectName("");
      fetchProjects();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleJoinProject = async () => {
    if (!joinId.trim()) return;
    try {
      await axios.post(
        `http://localhost:9000/api/projects/${joinId}/join`,
        {},
        { withCredentials: true }
      );
      setJoinId("");
      fetchProjects();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          {currentUser?.avatar && (
            <img
              src={`http://localhost:9000/${currentUser.avatar}`}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <h1 className="text-xl font-semibold">
            Welcome, {currentUser?.fullName || "User"} 👋
          </h1>
        </div>

        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-medium mb-2">Create a Project</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              onClick={handleCreateProject}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-medium mb-2">Join a Project</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Project ID"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              onClick={handleJoinProject}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Join
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Your Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-600">No projects yet.</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li
                  key={project._id}
                  className="border px-4 py-2 rounded hover:bg-gray-50"
                >
                  <Link href={`/project/${project._id}`} className="block">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-gray-500">
                      ID: {project._id}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
