
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ShieldAlert, CheckCircle, AlertTriangle, History, Search, Link as LinkIcon, FileText, MessageSquare, Timer, Trash2, User, Activity, ShieldCheck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [inputData, setInputData] = useState('');
    const [senderInfo, setSenderInfo] = useState('');
    const [contentType, setContentType] = useState('url'); // 'url', 'text', 'message'
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [fetchingHistory, setFetchingHistory] = useState(true);

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/scan/history?content_type=${contentType}`);
            setHistory(res.data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setFetchingHistory(false);
        }
    };

    useEffect(() => {
        setResult(null);
        setInputData('');
        setSenderInfo('');
        setHistory([]);
        setFetchingHistory(false);
    }, [contentType]);

    const handleScan = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await api.post('/scan/analyze', {
                content: inputData,
                sender: senderInfo,
                content_type: contentType
            });
            setResult(res.data);
            setHistory(prev => [res.data, ...prev].slice(0, 10)); // Local session update

            if (res.data.result_class === 'PHISHING') {
                alert(`🚨 CYBER THREAT DETECTED!\nVerdict: ${res.data.result_class}\nRisk: ${res.data.risk_level}\nAction: ${res.data.action}`);
            } else {
                alert("✅ CONTENT IS SECURE: System analysis confirms no immediate threat.");
            }
        } catch (error) {
            console.error("Scan failed", error);
            alert("Digital Shield Link Interrupted. Ensure central AI core is active.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/scan/delete/${id}`);
            setHistory(history.filter(item => item.id !== id));
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div style={{ background: '#0a0a0c', minHeight: '100vh', color: '#fff' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>

                {/* Mode Selector */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', justifyContent: 'center' }}>
                    {[
                        { id: 'url', icon: <LinkIcon size={18} />, label: 'URL / Link' },
                        { id: 'text', icon: <FileText size={18} />, label: 'Email Content' },
                        { id: 'message', icon: <MessageSquare size={18} />, label: 'Live Message/SMS' }
                    ].map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => setContentType(mode.id)}
                            className={`btn ${contentType === mode.id ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            {mode.icon} {mode.label}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>

                    {/* Left: Input Console */}
                    <div style={{ gridColumn: 'span 8' }}>
                        <motion.div
                            key={contentType}
                            initial={{ opacity: 0, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card"
                            style={{ background: '#111114', border: '1px solid #222', borderRadius: '16px' }}
                        >
                            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
                                        Cyber Resilience Analysis
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        AI Core listening for {contentType.toUpperCase()} threats in real-time.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '20px', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600' }}>
                                    <Activity size={14} className="animate-pulse" /> LIVE SYSTEM
                                </div>
                            </div>

                            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#555' }} />
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Sender Intel (Optional)..."
                                        value={senderInfo}
                                        onChange={(e) => setSenderInfo(e.target.value)}
                                        style={{ paddingLeft: '40px', background: '#1a1a1e', border: '1px solid #333' }}
                                    />
                                </div>
                                <textarea
                                    className="input-field"
                                    rows="6"
                                    placeholder={
                                        contentType === 'url' ? "Paste Live URL(s) for instant validation..." :
                                            contentType === 'text' ? "Paste incoming email payload..." :
                                                "Paste SMS/Message content for smishing analysis..."
                                    }
                                    value={inputData}
                                    onChange={(e) => setInputData(e.target.value)}
                                    style={{ resize: 'none', background: '#1a1a1e', border: '1px solid #333', fontSize: '1rem' }}
                                />
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={handleScan}
                                disabled={loading || !inputData}
                                style={{ width: '100%', padding: '1rem', fontWeight: '700', fontSize: '1.1rem', borderRadius: '12px' }}
                            >
                                {loading ? 'INTERPRETING THREAT PATTERNS...' : 'EXECUTE AI ANALYSIS'}
                            </button>

                            {/* Result Display - New Strict Format */}
                            <AnimatePresence>
                                {result && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ marginTop: '2.5rem', padding: '2rem', background: '#0c0c0e', border: `1px solid ${result.result_class === 'PHISHING' ? '#ef444433' : '#10b98133'}`, borderRadius: '12px' }}
                                    >
                                        <div className="flex justify-between items-start" style={{ marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                {result.result_class === 'PHISHING' ? <XCircle size={48} color="#ef4444" /> : <ShieldCheck size={48} color="#10b981" />}
                                                <div>
                                                    <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: '800' }}>Final Verdict</div>
                                                    <div style={{ fontSize: '2rem', fontWeight: '900', color: result.result_class === 'PHISHING' ? '#ef4444' : '#10b981' }}>{result.result_class}</div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', fontWeight: '800' }}>Risk Severity</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{result.risk_level} ({result.risk_score}/100)</div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                            <div>
                                                <div style={{ color: '#fff', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>Confidence Signals</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.85rem' }}>
                                                        <span style={{ color: '#888' }}>ML Model Probability:</span>
                                                        <span style={{ color: 'var(--accent)', marginLeft: 'auto', fontWeight: '700' }}>{(result.ml_signal * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.85rem' }}>
                                                        <span style={{ color: '#888' }}>LLM Reasoning Signal:</span>
                                                        <span style={{ color: 'var(--accent)', marginLeft: 'auto', fontWeight: '700' }}>{(result.reasoning_signal * 100).toFixed(0)}%</span>
                                                    </div>
                                                </div>

                                                <div style={{ color: '#fff', fontWeight: '700', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>Key Indicators</div>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {result.indicators.map((ind, idx) => (
                                                        <li key={idx} style={{ color: '#aaa', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <div style={{ minWidth: '6px', height: '6px', background: result.result_class === 'PHISHING' ? '#ef4444' : '#10b981', borderRadius: '50%' }}></div>
                                                            {ind}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <div style={{ color: '#fff', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>System Recommendation</div>
                                                <div style={{ padding: '1rem', background: result.result_class === 'PHISHING' ? '#ef444411' : '#10b98111', color: result.result_class === 'PHISHING' ? '#ef4444' : '#10b981', borderRadius: '8px', fontWeight: '700', textAlign: 'center' }}>
                                                    {result.action.toUpperCase()}
                                                </div>
                                                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>Threat Class: {result.threat_type}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Right: Monitoring Logs */}
                    <div style={{ gridColumn: 'span 4' }}>
                        <div className="card" style={{ background: '#111114', border: '1px solid #222', height: 'fit-content' }}>
                            <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                                <History size={20} color="var(--accent)" />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Session Intel Log</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {history.length === 0 ? (
                                    <p style={{ color: '#444', textAlign: 'center', padding: '2rem' }}>No activity in current buffer.</p>
                                ) : (
                                    history.map((h) => (
                                        <div key={h.id} style={{ padding: '0.75rem', background: '#1a1a1e', borderRadius: '8px', borderLeft: `3px solid ${h.result_class === 'PHISHING' ? '#ef4444' : '#10b981'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ maxWidth: '75%' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.content}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px' }}>
                                                    {h.result_class} • {formatDate(h.created_at)}
                                                </div>
                                            </div>
                                            <button onClick={() => handleDelete(h.id)} style={{ color: '#444' }} className="hover:text-red-500">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
