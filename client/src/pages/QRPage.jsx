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
        <div>
            {/* Header */}
            <div className="text-center mb-4">
                <h1 style={{ color: '#EF4444' }}>Emergency Help</h1>
                <p className="text-muted">Vehicle Reference: {data.owner_name ? data.owner_name : 'N/A'}</p>
            </div>

            {mode === 'view' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <button
                        className="emergency-btn btn-green"
                        onClick={() => setMode('contact')}
                    >
                        <Phone size={32} />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Call Owner / Family</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Click to reveal numbers</div>
                        </div>
                    </button>

                    <button
                        className="emergency-btn btn-red"
                        onClick={handleIncidentReport}
                    >
                        <AlertTriangle size={32} />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Accident / Incident</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>I need help / Reporting an issue</div>
                        </div>
                    </button>
                </div>
            )}

            {mode === 'contact' && (
                <div className="card text-center">
                    <h3>Emergency Contacts</h3>
                    <p className="text-muted mb-4">Tap to call immediately</p>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {data.emergency_contacts && data.emergency_contacts.map((contact, i) => {
                            const num = typeof contact === 'object' ? contact.number : contact;
                            const label = typeof contact === 'object' && contact.label ? contact.label : `Emergency Contact ${i + 1}`;

                            if (!num) return null;

                            return (
                                <a key={i} href={`tel:${num}`} className="btn-primary" style={{ textDecoration: 'none', background: '#10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Phone size={20} />
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '400', opacity: 0.9 }}>{label}</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{num}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '1.2rem' }}>📞</div>
                                </a>
                            );
                        })}
                    </div>
                    <button onClick={() => setMode('view')} className="btn-secondary mt-4">Go Back</button>
                </div>
            )}

            {mode === 'incident' && (
                <div className="card">
                    <div className="text-center mb-4">
                        <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto' }} />
                        <h2>Incident Reported</h2>
                        <p className="text-muted">ID: {new Date().getTime().toString().substr(-6)}</p>
                    </div>

                    <div style={{ background: '#FEF2F2', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #FECACA', color: '#7F1D1D' }}>
                        <h4 style={{ color: '#991B1B', marginBottom: '0.5rem' }}>Safety First Steps:</h4>
                        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                            <li>Ensure everyone is safe.</li>
                            <li>Call <strong>911</strong> (or 112) if anyone is injured.</li>
                            <li>Take photos of the scene if safe.</li>
                            <li>Do not admit fault or argue.</li>
                        </ul>
                    </div>

                    <button onClick={() => setMode('contact')} className="btn-primary mt-4">
                        Need to contact owner?
                    </button>
                </div>
            )}
        </div>
    );
}
