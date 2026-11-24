const mongoose = require("mongoose");
const Contact = require("../models/Contact");

async function createContact(req, res) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const subject = String(req.body.subject || "").trim();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required.",
      });
    }

    if (
      name.length > 100 ||
      email.length > 150 ||
      subject.length > 200 ||
      message.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields are too long.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been received successfully!",
      data: {
        id: contact._id,
      },
    });
  } catch (error) {
    console.error("Create contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save your message. Please try again later.",
    });
  }
}

async function getContacts(req, res) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load contact messages.",
    });
  }
}

async function markContactRead(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Mark contact read error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update message.",
    });
  }
}

async function deleteContact(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete message.",
    });
  }
}

module.exports = {
  createContact,
  getContacts,
  markContactRead,
  deleteContact,
};
