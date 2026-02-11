import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, AlertTriangle, CheckCircle } from 'lucide-react';

export default function QRPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mode, setMode] = useState('view'); // view | incident | contact

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/public/qr/${id}`);
            if (!res.ok) {
                const err = await res.json();
                setError(err.error || 'QR not found');
            } else {
                const d = await res.json();
                setData(d);
            }
        } catch (err) {
            setError('Network error');
        }
        setLoading(false);
    };

    const handleIncidentReport = async () => {
        // Report incident
        try {
            await fetch('/api/public/incident', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qr_id: id })
            });
            setMode('incident');
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="text-center mt-4">Loading encrypted data...</div>;
    if (error) return (
        <div className="card text-center" style={{ marginTop: '2rem' }}>
            <AlertTriangle size={48} color="red" style={{ margin: '0 auto', display: 'block' }} />
            <h1>Invalid QR</h1>
            <p>{error}</p>
        </div>
    );

    return (
        <div style={{ marginTop: '2rem', paddingBottom: '2rem' }}>
            <div className="login-card-polished">
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 style={{ color: '#EF4444', fontSize: '1.75rem' }}>Emergency Help</h1>
                    <p className="text-muted">Vehicle Reference: <br /><strong>{data.owner_name ? data.owner_name : 'N/A'}</strong></p>
                </div>

                {mode === 'view' && (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button
                            className="emergency-btn btn-green"
                            style={{ margin: 0, padding: '1rem' }}
                            onClick={() => setMode('contact')}
                        >
                            <Phone size={28} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 'bold' }}>Call Owner / Family</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Click to reveal numbers</div>
                            </div>
                        </button>

                        <button
                            className="emergency-btn btn-red"
                            style={{ margin: 0, padding: '1rem' }}
                            onClick={handleIncidentReport}
                        >
                            <AlertTriangle size={28} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 'bold' }}>Accident / Incident</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>I need help / Reporting an issue</div>
                            </div>
                        </button>
                    </div>
                )}

                {mode === 'contact' && (
                    <div className="text-center">
                        <h3>Emergency Contacts</h3>
                        <p className="text-muted mb-4 text-sm">Tap to call immediately</p>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {data.emergency_contacts && data.emergency_contacts.map((contact, i) => {
                                const num = typeof contact === 'object' ? contact.number : contact;
                                const label = typeof contact === 'object' && contact.label ? contact.label : `Emergency Contact ${i + 1}`;

                                if (!num) return null;

                                return (
                                    <a key={i} href={`tel:${num}`} className="btn-primary" style={{ textDecoration: 'none', background: '#10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                                                <Phone size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: '500', opacity: 0.9, color: 'white' }}>{label}</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>{num}</div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                        <button onClick={() => setMode('view')} className="btn-secondary mt-4" style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)' }}>
                            &larr; Go Back
                        </button>
                    </div>
                )}

                {mode === 'incident' && (
                    <div>
                        <div className="text-center mb-4">
                            <div style={{ background: '#FEF2F2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                                <AlertTriangle size={32} color="#EF4444" />
                            </div>
                            <h2 style={{ fontSize: '1.5rem' }}>Emergency Services</h2>
                            <p className="text-muted text-sm">Tap below to call immediately (India)</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                            <a href="tel:112" className="btn-primary" style={{ textDecoration: 'none', background: '#EF4444', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', gridColumn: '1 / -1' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>112</div>
                                <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 'normal' }}>National Emergency</div>
                            </a>

                            <a href="tel:100" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1F2937' }}>100</div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Police</div>
                            </a>

                            <a href="tel:108" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1F2937' }}>108</div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Ambulance</div>
                            </a>
                        </div>

                        <div style={{ background: '#F0F9FF', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #BAE6FD', color: '#0369A1', textAlign: 'left', marginBottom: '1rem' }}>
                            <h4 style={{ color: '#0284C7', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Quick Actions:</h4>
                            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.5', fontSize: '0.9rem' }}>
                                <li>Ensure safety of yourself and others.</li>
                                <li>Do not move injured persons unless critical.</li>
                                <li>Take photos of the scene.</li>
                            </ul>
                        </div>

                        <button onClick={() => setMode('contact')} className="btn-primary" style={{ background: '#10B981' }}>
                            <Phone size={18} /> Call Car Owner
                        </button>

                        <button onClick={() => setMode('view')} className="btn-secondary mt-3" style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)' }}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="text-center mt-4">
                <p className="text-muted text-sm" style={{ opacity: 0.7 }}>Powered by CarSafe</p>
            </div>
        </div>
    );
}
