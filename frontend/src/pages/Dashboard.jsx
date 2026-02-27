import { Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import './Dashboard.css';

// Mock Data
const statCards = [
    { title: 'Total Farmers Reviewed', value: '248', trend: '+ 12 this week', icon: Users, color: 'blue' },
    { title: 'Pending Requests', value: '17', trend: '3 urgent', icon: Clock, color: 'yellow' },
    { title: 'High Risk Farmers', value: '34', trend: '+ 5 vs last month', icon: AlertTriangle, color: 'red' },
    { title: 'Approved Today', value: '9', trend: '+ 2 vs yesterday', icon: CheckCircle, color: 'green' },
];

const recentApps = [
    { id: 1, initial: 'R', name: 'Ramesh Kumar Patel', detail: 'Nashik • Sugarcane', score: 82, risk: 'LOW' },
    { id: 2, initial: 'S', name: 'Sunita Devi Sharma', detail: 'Pune • Wheat', score: 61, risk: 'MEDIUM' },
    { id: 3, initial: 'G', name: 'Gopal Singh Yadav', detail: 'Amravati • Cotton', score: 41, risk: 'HIGH' },
    { id: 4, initial: 'P', name: 'Priya Bai Meena', detail: 'Satara • Soybean', score: 78, risk: 'LOW' },
    { id: 5, initial: 'M', name: 'Manoj Kumar Verma', detail: 'Nagpur • Orange', score: 55, risk: 'MEDIUM' },
];

function Dashboard() {
    return (
        <div className="dashboard">
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className={`card stat-card border-${stat.color}`}>
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

            <div className="dashboard-content">
                <div className="card chart-card">
                    <div className="card-header">
                        <h2>Risk Distribution</h2>
                        <span className="subtitle">All reviewed farmers</span>
                    </div>
                    <div className="chart-container">
                        {/* Simple CSS Donut Chart representation */}
                        <div className="donut-chart">
                            <div className="donut-hole">
                                <span className="donut-value">248</span>
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
                        {recentApps.map(app => (
                            <div key={app.id} className="app-item">
                                <div className={`app-initial initial-${app.risk.toLowerCase()}`}>
                                    {app.initial}
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
