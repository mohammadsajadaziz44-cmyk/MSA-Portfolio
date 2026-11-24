const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  createContact,
  getContacts,
  markContactRead,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

// Public: receive a new contact message
router.post("/", createContact);

// Protected: admin message management
router.get("/", protect, getContacts);
router.patch("/:id/read", protect, markContactRead);
router.delete("/:id", protect, deleteContact);

module.exports = router;
