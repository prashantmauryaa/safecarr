const express = require('express');
const router = express.Router();
const { db } = require('../db/init');
const { v4: uuidv4 } = require('uuid');

router.get('/qr/:qr_id', (req, res) => {
    const { qr_id } = req.params;

    const profile = db.prepare('SELECT owner_name, emergency_contacts, is_active FROM qr_profiles WHERE qr_id = ?').get(qr_id);

    if (!profile) {
        return res.status(404).json({ error: "QR Code not found" });
    }

    if (!profile.is_active) {
        return res.status(403).json({ error: "This QR Code has been deactivated by the owner" });
    }

    // Parse contacts
    try {
        profile.emergency_contacts = JSON.parse(profile.emergency_contacts);
    } catch (e) {
        profile.emergency_contacts = [];
    }

    res.json(profile); // Public data
});

router.post('/incident', (req, res) => {
    const { qr_id, location } = req.body;

    // Verify QR exists
    const profile = db.prepare('SELECT qr_id FROM qr_profiles WHERE qr_id = ?').get(qr_id);
    if (!profile) return res.status(404).json({ error: "Invalid QR" });

    const id = uuidv4();
    db.prepare('INSERT INTO incidents (id, qr_id, location) VALUES (?, ?, ?)').run(id, qr_id, location || "");

    // Optional: Trigger notification logic here (mock)
    console.log(`[INCIDENT REPORTED] QR: ${qr_id}, Loc: ${location}`);

    res.json({ success: true, incident_id: id });
});

module.exports = router;
