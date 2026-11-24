const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 1200 },
    technologies: [{ type: String, trim: true, maxlength: 40 }],
    liveUrl: { type: String, trim: true, default: "" },
    githubUrl: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
