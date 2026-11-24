const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  getPortfolio,
  updatePortfolio,
} = require("../controllers/portfolioController");

const router = express.Router();

// Public: Get portfolio information
router.get("/", getPortfolio);

// Admin only: Update portfolio information
router.put("/", protect, updatePortfolio);

module.exports = router;
