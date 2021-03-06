const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Contact = require("../models/Contacts");

const auth = require("../middleware/auth");

// Get all contacts for a signed in user
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: "-1",
    });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error, asshole" });
  }
});

// Add contact
router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    // Validate data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, phone, email, type } = req.body;
      const newContact =   new Contact({
        name,
        phone,
        email,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error..." });
    }
  }
);

router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  const contactObj = {};

  if (name) contactObj.name = name;
  if (email) contactObj.email = email;
  if (phone) contactObj.phone = phone;
  if (type) contactObj.type = type;

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found." });
    }

    // Make sure that the signed in user owns the contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactObj,
      },
      { new: true }
    );

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error..." });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    // make sure contact exists
    if (!contact) return res.status(404).json({ msg: "Contact not found..." });

    // Make user owns the contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Delete the contact and return it that it was deleted
    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "Contact removed..." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error..." });
  }
});

module.exports = router;
