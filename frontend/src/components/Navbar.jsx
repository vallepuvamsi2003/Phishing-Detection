
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <nav className="navbar">
            <div className="container flex justify-between items-center" style={{ width: '100%' }}>
                <Link to="/" className="logo">
                    <Shield size={32} color="var(--accent)" />
                    Phish<span>Guard AI</span>
                </Link>

                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link flex items-center gap-2">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link">Admin</Link>
                            )}

                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2"
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '2rem',
                                        border: '1px solid var(--glass-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.9rem', fontWeight: 'bold'
                                    }}>
                                        {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                                    </div>
                                    <span style={{ fontSize: '0.9rem' }}>{user.fullName?.split(' ')[0]}</span>
                                </button>

                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            style={{
                                                position: 'absolute',
                                                top: '120%',
                                                right: 0,
                                                background: 'var(--bg-tertiary)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '0.75rem',
                                                padding: '0.5rem',
                                                minWidth: '160px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.25rem' }}>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Signed in as</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                                            </div>
                                            <button
                                                onClick={logout}
                                                className="flex items-center gap-2"
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    color: 'var(--danger)',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    background: 'transparent'
                                                }}
                                            >
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/login" className="nav-link">Sign In</Link>
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
