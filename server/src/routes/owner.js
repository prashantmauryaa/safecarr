const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db/init');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

// Get Profile
router.get('/profile', (req, res) => {
    const profile = db.prepare('SELECT * FROM qr_profiles WHERE user_id = ?').get(req.user.id);
    res.json(profile || {});
});

// Update/Create Profile
router.post('/profile', (req, res) => {
    const { owner_name, emergency_contacts } = req.body;

    if (!emergency_contacts || emergency_contacts.length === 0) {
        return res.status(400).json({ error: "At least one emergency number is required" });
    }

    let profile = db.prepare('SELECT * FROM qr_profiles WHERE user_id = ?').get(req.user.id);

    const contactsJson = JSON.stringify(emergency_contacts);

    if (profile) {
        db.prepare(`
      UPDATE qr_profiles 
      SET owner_name = ?, emergency_contacts = ? 
      WHERE user_id = ?
    `).run(owner_name, contactsJson, req.user.id);
    } else {
        // Generate new QR ID (short UUID part)
        const qr_id = uuidv4().split('-')[0];
        db.prepare(`
      INSERT INTO qr_profiles (qr_id, user_id, owner_name, emergency_contacts)
      VALUES (?, ?, ?, ?)
    `).run(qr_id, req.user.id, owner_name, contactsJson);
        profile = { qr_id };
    }

    const updated = db.prepare('SELECT * FROM qr_profiles WHERE user_id = ?').get(req.user.id);
    res.json(updated);
});

module.exports = router;
