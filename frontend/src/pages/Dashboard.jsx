import { Users, Clock, AlertTriangle, CheckCircle, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState({
        total_farmers: 248,
        pending_requests: 17,
        high_risk_farmers: 34,
        approved_today: 9
    });
    const [recentApps, setRecentApps] = useState([]);
    const [viewStatus, setViewStatus] = useState(null); // 'Pending', 'Approved', 'Rejected'
    const [statusApps, setStatusApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const statsRes = await fetch('/dashboard/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            const recentRes = await fetch('/applications/recent');
            const recentData = await recentRes.json();
            setRecentApps(recentData);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatusDetails = async (status) => {
        try {
            const res = await fetch(`/applications?status=${status}`);
            const data = await res.json();
            setStatusApps(data);
            setViewStatus(status);
        } catch (error) {
            console.error("Failed to fetch status details:", error);
        }
    };

    const statCardsData = [
        { title: 'Total Farmers Reviewed', value: stats.total_farmers, trend: '+ 12 current', icon: Users, color: 'blue', status: null },
        { title: 'Pending Requests', value: stats.pending_requests, trend: '3 urgent', icon: Clock, color: 'yellow', status: 'Pending' },
        { title: 'High Risk Farmers', value: stats.high_risk_farmers, trend: 'All high risk', icon: AlertTriangle, color: 'red', status: 'High Risk' },
        { title: 'Approved Today', value: stats.approved_today, trend: 'Total today', icon: CheckCircle, color: 'green', status: 'Approved' },
    ];

    const highPct = stats.total_farmers > 0 ? (stats.high_risk_farmers / stats.total_farmers) * 100 : 15;
    const mediumPct = stats.total_farmers > 0 ? (stats.medium_risk_farmers / stats.total_farmers) * 100 : 30;
    const lowPct = stats.total_farmers > 0 ? (stats.low_risk_farmers / stats.total_farmers) * 100 : 55;

    const donutStyle = {
        background: `conic-gradient(#ef4444 0% ${highPct}%, #f59e0b ${highPct}% ${highPct + mediumPct}%, #10b981 ${highPct + mediumPct}% 100%)`
    };

    return (
        <div className="dashboard">
            <div className="stats-grid">
                {statCardsData.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`card stat-card border-${stat.color} ${stat.status ? 'clickable' : ''}`}
                        onClick={() => stat.status && fetchStatusDetails(stat.status)}
                    >
                        <div className="stat-header">
                            <div className={`stat-icon text-${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="stat-trend">{stat.trend}</span>
                        </div>
                        <div className="stat-body">
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {viewStatus && (
                <div className="card details-card animate-slide-up">
                    <div className="card-header details-header">
                        <div className="header-left">
                            <button className="btn-back" onClick={() => setViewStatus(null)}>
                                <ChevronLeft size={20} />
                            </button>
                            <div>
                                <h2>{viewStatus} Applications</h2>
                                <span className="subtitle">Detailed list of {viewStatus.toLowerCase()} requests</span>
                            </div>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="details-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Farmer Name</th>
                                    <th>District</th>
                                    <th>Crop</th>
                                    <th>Land Size</th>
                                    <th>Loan Amount</th>
                                    <th>TRUST SCORE</th>
                                    <th>DATE</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statusApps.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="empty-table">No applications found for this status.</td>
                                    </tr>
                                ) : (
                                    statusApps.map(app => (
                                        <tr key={app.id}>
                                            <td>#{app.id}</td>
                                            <td className="font-bold">{app.farmer_name}</td>
                                            <td>{app.district}</td>
                                            <td>{app.crop_type}</td>
                                            <td>{app.land_size} Acres</td>
                                            <td>₹{app.loan_amount.toLocaleString()}</td>
                                            <td>
                                                <span className={`score-badge risk-${(app.risk_category || 'low').split(' ')[0].toLowerCase()}`}>
                                                    {Math.round(app.trust_score)}
                                                </span>
                                            </td>
                                            <td className="text-secondary">{new Date(app.created_at + 'Z').toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-pill pill-${app.status.toLowerCase()}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                <div className="card chart-card">
                    <div className="card-header">
                        <h2>Risk Distribution</h2>
                        <span className="subtitle">All reviewed farmers</span>
                    </div>
                    <div className="chart-container">
                        {/* Dynamic CSS Donut Chart */}
                        <div className="donut-chart" style={donutStyle}>
                            <div className="donut-hole">
                                <span className="donut-value">{stats.total_farmers}</span>
                                <span className="donut-label">TOTAL</span>
                            </div>
                        </div>
                        <div className="chart-legend">
                            <div className="legend-item"><span className="dot bg-green"></span> Low Risk</div>
                            <div className="legend-item"><span className="dot bg-yellow"></span> Medium Risk</div>
                            <div className="legend-item"><span className="dot bg-red"></span> High Risk</div>
                        </div>
                    </div>
                </div>

                <div className="card recent-apps-card">
                    <div className="card-header">
                        <h2>Recent Applications</h2>
                        <span className="subtitle">Last 5 reviewed</span>
                    </div>
                    <div className="apps-list">
                        {recentApps.length === 0 ? (
                            <div className="empty-recent">No recent applications found.</div>
                        ) : (
                            recentApps.map(app => (
                                <div key={app.id} className="app-item">
                                    <div className={`app-initial initial-${app.risk.toLowerCase()}`}>
                                        {app.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="app-info">
                                        <h4>{app.name}</h4>
                                        <p>{app.detail}</p>
                                    </div>
                                    <div className="app-score">
                                        <span className="score-value">{app.score}</span>
                                        <span className={`status-badge status-${app.risk.toLowerCase()}`}>{app.risk}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
