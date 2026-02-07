import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, EyeOff, Lock, Zap, MessageSquare, AlertTriangle, PhoneCall } from 'lucide-react';

export default function Home() {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const [authMode, setAuthMode] = useState('signin'); // signin | signup
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await res.json();

            if (res.ok) {
                navigate('/dashboard');
            } else {
                setMessage(data.error || 'Login failed');
            }
        } catch (err) {
            setMessage('Network error');
        }
        setLoading(false);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await res.json();

            if (res.ok) {
                navigate('/dashboard');
            } else {
                setMessage(data.error || 'Signup failed');
            }
        } catch (err) {
            setMessage('Network error');
        }
        setLoading(false);
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* SECTION 1: HERO AREA */}
            <div className="text-center landing-section" style={{ border: 'none', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)', filter: 'drop-shadow(0 0 10px rgba(255, 77, 77, 0.3))' }}>
                    <ShieldCheck size={56} />
                </div>
                <h1>CarSafe</h1>
                <p className="hero-tagline">
                    Emergency help for your car, accessible with a simple scan.
                </p>
                <p className="text-sm text-muted mb-4" style={{ marginTop: '-1rem' }}>
                    Designed for emergencies. Simple, fast, and reliable.
                </p>

                {/* POLISHED LOGIN CARD */}
                <div className="login-card-polished">
                    {/* TABS */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '1.5rem' }}>
                        <button
                            onClick={() => { setAuthMode('signin'); setMessage(''); }}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: authMode === 'signin' ? '2px solid var(--primary)' : '2px solid transparent',
                                fontWeight: authMode === 'signin' ? 'bold' : 'normal',
                                color: authMode === 'signin' ? 'var(--primary)' : 'var(--text-muted)',
                                cursor: 'pointer'
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setAuthMode('signup'); setMessage(''); }}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: authMode === 'signup' ? '2px solid var(--primary)' : '2px solid transparent',
                                fontWeight: authMode === 'signup' ? 'bold' : 'normal',
                                color: authMode === 'signup' ? 'var(--primary)' : 'var(--text-muted)',
                                cursor: 'pointer'
                            }}
                        >
                            Sign Up
                        </button>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                        {authMode === 'signin' ? 'Welcome back' : 'Create Account'}
                    </h2>
                    <p className="text-muted text-sm mb-4">
                        {authMode === 'signin' ? 'Log in to manage your QR.' : 'Sign up to generate your emergency QR.'}
                    </p>

                    {message && <div style={{ padding: '0.5rem', background: '#FEF2F2', color: '#EF4444', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{message}</div>}

                    {authMode === 'signin' ? (
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="btn-primary" disabled={loading} style={{ boxShadow: '0 4px 6px -1px rgba(255, 77, 77, 0.3)' }}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                            <div className="text-center mt-3">
                                <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Forgot password?</a>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSignup}>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="btn-primary" disabled={loading} style={{ boxShadow: '0 4px 6px -1px rgba(255, 77, 77, 0.3)' }}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>

                {/* SECTION 2: TRUST INDICATORS */}
                <div className="trust-indicators">
                    <div className="trust-item"><Smartphone size={16} /> Works with your phone camera</div>
                    <div className="trust-item"><EyeOff size={16} /> No public profile ever</div>
                    <div className="trust-item"><Zap size={16} /> Instant access in emergencies</div>
                </div>
            </div>

            {/* SECTION 3: HOW IT WORKS */}
            <div className="landing-section">
                <h3 className="text-center mb-4">How it works</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="step-card">
                        <span className="step-number">1</span>
                        <div>
                            <strong>Generate your QR</strong>
                            <p className="text-muted text-sm">Log in once and create a unique secure QR code for your car.</p>
                        </div>
                    </div>
                    <div style={{ paddingLeft: '24px', borderLeft: '2px dashed var(--border)', height: '1rem', width: '2px', marginLeft: '14px', opacity: 0.5 }}></div>
                    <div className="step-card">
                        <span className="step-number">2</span>
                        <div>
                            <strong>Place it on your car</strong>
                            <p className="text-muted text-sm">Attach or stick it where it is easily visible from the outside.</p>
                        </div>
                    </div>
                    <div style={{ paddingLeft: '24px', borderLeft: '2px dashed var(--border)', height: '1rem', width: '2px', marginLeft: '14px', opacity: 0.5 }}></div>
                    <div className="step-card highlight">
                        <span className="step-number">3</span>
                        <div>
                            <strong>Scan in an emergency</strong>
                            <p className="text-muted text-sm">Anyone can scan to access help. <strong>No login required for them.</strong></p>
                        </div>
                    </div>
                </div>
                <p className="text-center text-sm text-muted mt-4">
                    No apps. No logins for helpers. No confusion when it matters.
                </p>
            </div>

            {/* SECTION 4: USEFUL SCENARIOS */}
            <div className="landing-section">
                <h3 className="text-center mb-4">When is this useful?</h3>
                <div className="feature-list">
                    <div className="feature-item">
                        <AlertTriangle className="text-muted" size={20} />
                        <span>After a road accident or collision</span>
                    </div>
                    <div className="feature-item">
                        <PhoneCall className="text-muted" size={20} />
                        <span>Wrong parking or blocking someone</span>
                    </div>
                    <div className="feature-item">
                        <MessageSquare className="text-muted" size={20} />
                        <span>If you are unable to respond medically</span>
                    </div>
                </div>
                <p className="text-center text-sm text-muted mt-4" style={{ fontStyle: 'italic' }}>
                    "CarSafe does not prevent accidents. It helps reduce confusion after one."
                </p>
            </div>

            {/* SECTION 5: DATA PRIVACY */}
            <div className="landing-section">
                <h3 className="text-center mb-4">Your Data & Privacy</h3>
                <div className="feature-list">
                    <div className="feature-item">
                        <Lock className="text-muted" size={20} />
                        <span>Only YOU can edit or deactivate your data.</span>
                    </div>
                    <div className="feature-item">
                        <EyeOff className="text-muted" size={20} />
                        <span>Helpers get read-only access to emergency info.</span>
                    </div>
                    <div className="feature-item">
                        <ShieldCheck className="text-muted" size={20} />
                        <span>No ads, no tracking, no data selling.</span>
                    </div>
                </div>
            </div>

            {/* SECTION 6: FAQ */}
            <div className="landing-section">
                <h3 className="text-center mb-4">Frequently Asked</h3>

                <div className="faq-item">
                    <div className="faq-question">Do helpers need to download an app?</div>
                    <div className="text-muted text-sm">No. They just use their normal phone camera to scan the QR code.</div>
                </div>

                <div className="faq-item">
                    <div className="faq-question">Is my phone number public?</div>
                    <div className="text-muted text-sm">It is only visible to someone who is physically standing next to your car and scans the QR.</div>
                </div>

                <div className="faq-item">
                    <div className="faq-question">Can I turn it off?</div>
                    <div className="text-muted text-sm">Yes. You can deactivate your QR code instantly from your dashboard at any time.</div>
                </div>
            </div>

            {/* PRE-FOOTER REASSURANCE */}
            <div className="text-center" style={{ padding: '2rem 0', background: 'var(--bg)' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Your data stays under your control</h4>
                <p className="text-muted text-sm">You can update or deactivate your QR anytime.</p>
            </div>

            {/* FOOTER */}
            <div className="footer" style={{ borderTop: 'none', paddingTop: '0' }}>
                <p>&copy; {new Date().getFullYear()} CarSafe Project</p>
                <p style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: '0.8rem' }}>Privacy Policy &bull; Terms &bull; Contact</p>
            </div>
        </div>
    );
}
