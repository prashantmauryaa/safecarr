import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, Download } from 'lucide-react';

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    // Store objects: { number, label }
    const [contacts, setContacts] = useState([
        { number: '', label: '' },
        { number: '', label: '' }
    ]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/owner/profile');
            if (res.status === 401) return navigate('/');
            const data = await res.json();

            if (data.qr_id) {
                setProfile(data);
                setName(data.owner_name || '');

                let existingContacts = [];
                try {
                    const parsed = JSON.parse(data.emergency_contacts || '[]');
                    // Migration: Convert old string arrays to new object arrays
                    existingContacts = parsed.map((c, i) => {
                        if (typeof c === 'string') {
                            return { number: c, label: `Contact ${i + 1}` };
                        }
                        return c;
                    });
                } catch (e) {
                    existingContacts = [];
                }

                // Ensure at least 2 slots
                if (existingContacts.length === 0) existingContacts = [{ number: '', label: '' }, { number: '', label: '' }];
                else if (existingContacts.length === 1) existingContacts.push({ number: '', label: '' });

                setContacts(existingContacts);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Filter out empty numbers
        const validContacts = contacts.filter(c => c.number.trim() !== '');

        if (validContacts.length === 0) {
            setMessage("Please add at least one emergency contact number.");
            return;
        }

        const res = await fetch('/api/owner/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                owner_name: name,
                emergency_contacts: validContacts
            })
        });
        const data = await res.json();
        setProfile(data);
        setMessage("Profile saved successfully!");
        setTimeout(() => setMessage(''), 3000);
        fetchProfile();
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        navigate('/');
    };

    const handleContactChange = (index, field, value) => {
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setContacts(newContacts);
    };

    if (loading) return <div className="text-center mt-4">Loading...</div>;

    const qrValue = profile?.qr_id ? `${window.location.origin}/qr/${profile.qr_id}` : '';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Dashboard</h2>
                <button onClick={handleLogout} className="btn-secondary" style={{ width: 'auto', padding: '0.5rem' }}>
                    <LogOut size={16} />
                </button>
            </div>

            <div className="card">
                <h3>Your Emergency QR</h3>
                {profile?.qr_id ? (
                    <div className="text-center">
                        <div style={{ padding: '1rem', background: 'white', display: 'inline-block', borderRadius: '0.5rem' }}>
                            <QRCodeSVG
                                value={qrValue}
                                size={200}
                                id="qr-code-svg"
                                level="H"
                            />
                        </div>
                        <p className="text-sm text-muted mt-4">Scan to test: {qrValue}</p>
                        <div className="mt-4">
                            <a href={qrValue} target="_blank" className="btn-secondary" style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}>Open Link</a>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted">Save your details to generate a QR code.</p>
                )}
            </div>

            <div className="card">
                <h3>Emergency Data</h3>
                {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}
                <form onSubmit={handleSave}>
                    <div className="input-group">
                        <label>Owner Name (Optional)</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your Name (e.g. John Doe)"
                        />
                    </div>

                    <div className="input-group">
                        <label>Emergency Contact 1 (Required)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                            <input
                                value={contacts[0].label}
                                onChange={e => handleContactChange(0, 'label', e.target.value)}
                                placeholder="Who is this? (e.g. Dad, Spouse)"
                                style={{ marginBottom: '0.25rem' }}
                            />
                            <input
                                value={contacts[0].number}
                                onChange={e => handleContactChange(0, 'number', e.target.value)}
                                placeholder="Phone Number (e.g. +1 555-0100)"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Emergency Contact 2 (Optional)</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                            <input
                                value={contacts[1].label}
                                onChange={e => handleContactChange(1, 'label', e.target.value)}
                                placeholder="Who is this? (e.g. Brother, Friend)"
                                style={{ marginBottom: '0.25rem' }}
                            />
                            <input
                                value={contacts[1].number}
                                onChange={e => handleContactChange(1, 'number', e.target.value)}
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>

                    <button className="btn-primary">
                        <Save size={18} /> Save & Update QR
                    </button>
                    <p className="text-muted text-sm mt-4 text-center">
                        Note: You can update these details anytime.
                    </p>
                </form>
            </div>
        </div>
    );
}
