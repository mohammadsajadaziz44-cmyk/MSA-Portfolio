const mongoose = require("mongoose");
const Project = require("../models/project");

async function getProjects(req, res) {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
}

async function getProjectById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project ID." });
  }
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found." });
  res.json({ success: true, data: project });
}

function validateProject(body) {
  const title = String(body.title || "").trim();
  const category = String(body.category || "").trim();
  const description = String(body.description || "").trim();
  if (!title || !category || !description) {
    const error = new Error("Title, category and description are required.");
    error.statusCode = 400;
    throw error;
  }
  return {
    title,
    category,
    description,
    technologies: Array.isArray(body.technologies)
      ? body.technologies.map((item) => String(item).trim()).filter(Boolean)
      : String(body.technologies || "").split(",").map((item) => item.trim()).filter(Boolean),
    liveUrl: String(body.liveUrl || "").trim(),
    githubUrl: String(body.githubUrl || "").trim(),
    imageUrl: String(body.imageUrl || "").trim(),
    featured: Boolean(body.featured),
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0
  };
}

async function createProject(req, res) {
  const project = await Project.create(validateProject(req.body));
  res.status(201).json({ success: true, message: "Project created", data: project });
}

async function updateProject(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project ID." });
  }
  const project = await Project.findByIdAndUpdate(req.params.id, validateProject(req.body), {
    new: true, runValidators: true
  });
  if (!project) return res.status(404).json({ success: false, message: "Project not found." });
  res.json({ success: true, message: "Project updated", data: project });
}

async function deleteProject(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project ID." });
  }
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found." });
  res.json({ success: true, message: "Project deleted" });
}

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
