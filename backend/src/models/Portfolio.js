const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    // Home / Hero
    profile: {
      name: { type: String, default: "Mohammad Sajad Aziz" },
      brand: { type: String, default: "MSA Developer" },
      role: { type: String, default: "Frontend Developer" },
      heroDescription: { type: String, default: "" },
      location: { type: String, default: "Kabul, Afghanistan" },
      email: { type: String, default: "" },
      phoneDisplay: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      cv: { type: String, default: "" },
      photo: { type: String, default: "" },
      logo: { type: String, default: "" },
    },

    // About
    about: {
      heading: {
        type: String,
        default: "Building my future, one project at a time.",
      },
      paragraph1: { type: String, default: "" },
      paragraph2: { type: String, default: "" },
      currentRole: { type: String, default: "Frontend Developer" },
      education: { type: String, default: "High school student" },
      goal: { type: String, default: "Full-Stack Developer" },
    },

    // Skills
    skills: [
      {
        name: { type: String, required: true, trim: true },
        group: {
          type: String,
          enum: ["Frontend", "Design", "Tools"],
          default: "Frontend",
        },
      },
    ],

    // Education
    education: [
      {
        place: { type: String, required: true, trim: true },
        course: { type: String, required: true, trim: true },
        detail: { type: String, default: "" },
        type: { type: String, default: "School" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
