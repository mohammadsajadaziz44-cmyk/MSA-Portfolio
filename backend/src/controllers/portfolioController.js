const Portfolio = require("../models/Portfolio");

// Get portfolio information (Public)
async function getPortfolio(req, res) {
  let portfolio = await Portfolio.findOne();

  if (!portfolio) {
    portfolio = await Portfolio.create({});
  }

  res.status(200).json({
    success: true,
    data: portfolio,
  });
}

// Update portfolio information (Admin only)
async function updatePortfolio(req, res) {
  const allowedFields = ["profile", "about", "skills", "education"];

  const updates = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid portfolio information provided.",
    });
  }

  let portfolio = await Portfolio.findOne();

  if (!portfolio) {
    portfolio = await Portfolio.create(updates);
  } else {
    for (const [field, value] of Object.entries(updates)) {
      portfolio.set(field, value);
    }

    await portfolio.save();
  }

  res.status(200).json({
    success: true,
    message: "Portfolio information updated successfully.",
    data: portfolio,
  });
}

module.exports = {
  getPortfolio,
  updatePortfolio,
};
