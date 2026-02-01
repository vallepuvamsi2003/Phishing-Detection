
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Lock, Globe, Mail, BarChart3, ChevronRight, ShieldAlert, Cpu, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div style={{ background: 'var(--bg-color)', color: 'var(--text-primary)', minHeight: '100vh' }}>
            <Navbar />

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <div className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>
                            Next-Gen Cybersecurity Powered by AI
                        </div>
                        <h1 className="text-center">
                            Real-Time <span>AI Phishing</span> <br />
                            Protection System
                        </h1>
                        <p className="text-center">
                            Defend your digital identity with advanced NLP-based detection. Our machine learning engine analyzes URLs and emails in milliseconds to block zero-day threats before they execute.
                        </p>

                        <div className="flex gap-4 mt-8">
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                                Get Started <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '80px 0', background: 'rgba(255,255,255,0.01)' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Advanced Detection Engine</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Multipronged analysis approach to ensure 99.9% detection accuracy across all attack vectors.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <motion.div whileHover={{ y: -10 }} className="card">
                            <Cpu size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ marginBottom: '1rem' }}>ML/NLP Analysis</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Uses Random Forest and TF-IDF vectorization to identify semantic patterns in phishing content that bypass static filters.
                            </p>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="card">
                            <ShieldAlert size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ marginBottom: '1rem' }}>Zero-Day Prevention</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Detects brand-new, unseen phishing campaigns by analyzing behavioral heuristics and URL structure anomalies.
                            </p>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="card">
                            <Globe size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ marginBottom: '1rem' }}>Global Intelligence</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Integrated with global threat databases to provide real-time updates on emerging malicious domains and IP reputations.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section style={{ padding: '100px 0' }}>
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-12 items-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Continuous Learning System</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Our engine isn't static. It learns from every scan, improving its classification capabilities through our automated feedback loop and self-improving model design.
                            </p>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4 items-start">
                                    <div style={{ background: 'var(--accent)', borderRadius: '50%', padding: '4px', marginTop: '4px' }}><CheckCircle size={14} color="#000" /></div>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem' }}>Automated Reporting</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Instantly report threats to relevant authorities with one click.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div style={{ background: 'var(--accent)', borderRadius: '50%', padding: '4px', marginTop: '4px' }}><CheckCircle size={14} color="#000" /></div>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem' }}>Enterprise Ready</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>API access for seamless integration with corporate email systems.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card" style={{ border: '2px dashed var(--glass-border)', background: 'rgba(56, 189, 248, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <BarChart3 size={80} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.5rem' }}>Real-time Analytics Dashboard</h3>
                            <p style={{ color: 'var(--text-secondary)', padding: '0 2rem' }}>Get instant visual insights into threat landscapes and detection metrics.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '100px 0', textAlign: 'center' }}>
                <div className="container">
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Ready to Secure Your Workspace?</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '2.5rem' }}>Join thousands of users protected by the world's most advanced AI phishing detection.</p>
                        <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.25rem' }}>
                            Get PhishGuard AI Now
                        </Link>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '60px 0', borderTop: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <div className="container flex justify-between items-center">
                    <p>© 2026 PhishGuard AI. Built for the future of cybersecurity.</p>
                    <div className="flex gap-6">
                        <Link to="/">Privacy</Link>
                        <Link to="/">Integrations</Link>
                        <Link to="/">API Docs</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
