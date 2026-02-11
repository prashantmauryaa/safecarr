import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, ExternalLink, ShieldCheck, User } from 'lucide-react';

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
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
                    existingContacts = parsed.map((c, i) => {
                        if (typeof c === 'string') {
                            return { number: c, label: `Contact ${i + 1}` };
                        }
                        return c;
                    });
                } catch (e) {
                    existingContacts = [];
                }

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

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6B7280' }}>
            <div className="spinner"></div> {/* Apply spinner from CSS if available, otherwise just text */}
            Loading dashboard...
        </div>
    );

    const qrValue = profile?.qr_id ? `${window.location.origin}/qr/${profile.qr_id}` : '';

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* 1. Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#FEF2F2', padding: '8px', borderRadius: '8px', color: '#EF4444' }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '0', color: '#111827' }}>My Dashboard</h2>
                        <span className="text-xs text-muted" style={{ fontWeight: 500 }}>Manage your emergency profile</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn-secondary"
                    style={{ width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                >
                    <LogOut size={16} /> <span style={{ display: 'none', '@media (min-width: 400px)': { display: 'inline' } }}>Sign Out</span>
                </button>
            </div>

            {/* 2. Main Content Stack */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>

                {/* QR Access Card - Redesigned */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderTop: '4px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Emergency Access QR</h3>
                        <p className="text-sm text-muted">Place this on your vehicle windshield</p>
                    </div>

                    {profile?.qr_id ? (
                        <>
                            <div style={{
                                padding: '1.25rem',
                                background: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '1rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                marginBottom: '1.5rem'
                            }}>
                                <QRCodeSVG
                                    value={qrValue}
                                    size={180}
                                    level="H"
                                    imageSettings={{
                                        src: "/favicon.ico", // Optional logo if available
                                        x: undefined,
                                        y: undefined,
                                        height: 24,
                                        width: 24,
                                        excavate: true,
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '300px' }}>
                                <a
                                    href={qrValue}
                                    target="_blank"
                                    className="btn-secondary"
                                    style={{ flex: 1, fontSize: '0.9rem', justifyContent: 'center' }}
                                >
                                    <ExternalLink size={16} /> Test Link
                                </a>
                                {/* Download feature could be added here later */}
                            </div>
                        </>
                    ) : (
                        <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                            <p>Complete your profile below to generate your QR.</p>
                        </div>
                    )}
                </div>

                {/* Emergency Data Form - Cleaned Up */}
                <div className="card">
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} className="text-muted" /> Emergency Information
                        </h3>
                        <p className="text-sm text-muted">This information will be visible when the QR is scanned.</p>
                    </div>

                    {message && (
                        <div style={{
                            padding: '0.75rem',
                            background: message.includes('success') ? '#ECFDF5' : '#FEF2F2',
                            color: message.includes('success') ? '#065F46' : '#991B1B',
                            borderRadius: '0.5rem',
                            fontSize: '0.9rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSave}>
                        <div className="input-group">
                            <label>Display Name (Vehicle Owner)</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. John Doe"
                                style={{ fontWeight: 500 }}
                            />
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '1rem', display: 'block' }}>Emergency Contacts</label>

                            {/* Contact 1 */}
                            <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid #F3F4F6' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: '#6B7280' }}>Label</label>
                                        <input
                                            value={contacts[0].label}
                                            onChange={e => handleContactChange(0, 'label', e.target.value)}
                                            placeholder="e.g. Dad"
                                            style={{ padding: '0.5rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: '#6B7280' }}>Phone Number <span style={{ color: 'red' }}>*</span></label>
                                        <input
                                            value={contacts[0].number}
                                            onChange={e => handleContactChange(0, 'number', e.target.value)}
                                            placeholder="+91 98765 43210"
                                            required
                                            style={{ padding: '0.5rem' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact 2 */}
                            <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid #F3F4F6' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: '#6B7280' }}>Label (Optional)</label>
                                        <input
                                            value={contacts[1].label}
                                            onChange={e => handleContactChange(1, 'label', e.target.value)}
                                            placeholder="e.g. Spouse"
                                            style={{ padding: '0.5rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: '#6B7280' }}>Phone Number</label>
                                        <input
                                            value={contacts[1].number}
                                            onChange={e => handleContactChange(1, 'number', e.target.value)}
                                            placeholder="+91..."
                                            style={{ padding: '0.5rem' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="btn-primary" style={{ boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)' }}>
                            <Save size={18} /> Save Emergency Profile
                        </button>
                    </form>
                </div>
            </div>

            <div className="text-center mt-4 text-xs text-muted">
                <p>CarSafe v1.0 &bull; Secure Emergency Access</p>
            </div>
        </div>
    );
}
