import { useState, useEffect } from 'react';
import './FarmerProfiles.css';

function FarmerProfiles() {
    const [farmers, setFarmers] = useState([]);
    const [activeFarmerId, setActiveFarmerId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/applications');
            const data = await response.json();
            
            // Map backend data to frontend format
            const mappedFarmers = data.map(app => {
                const risk_raw = (app.risk_category || 'low').toUpperCase();
                const risk_label = risk_raw.includes('HIGH') ? 'HIGH' : (risk_raw.includes('MEDIUM') ? 'MEDIUM' : 'LOW');
                
                return {
                    id: `APP-${app.id.toString().padStart(3, '0')}`,
                    dbId: app.id,
                    initial: app.farmer_name.charAt(0).toUpperCase(),
                    name: app.farmer_name,
                    location: app.district,
                    crop: app.crop_type,
                    risk: risk_label,
                    score: Math.round(app.trust_score),
                    landSize: `${app.land_size} Acres`,
                    irrigation: app.irrigation_type || 'Unknown',
                    soil: `${app.soil_fertility_score} / 100`,
                    yield: `${app.yield_stability_score} / 100`,
                    rain: `${app.rainfall_deviation.toFixed(1)}%`,
                    defaultProb: risk_label === 'HIGH' ? 'High' : (risk_label === 'MEDIUM' ? 'Medium' : 'Low'),
                    loanAmount: app.loan_amount,
                    status: app.status === 'Approved' ? 'Accepted' : app.status,
                    date: app.created_at
                };
            });

            setFarmers(mappedFarmers);
            if (mappedFarmers.length > 0) {
                setActiveFarmerId(mappedFarmers[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch farmers:", error);
        } finally {
            setLoading(false);
        }
    };

    const activeFarmer = farmers.find(f => f.id === activeFarmerId) || farmers[0];

    if (loading) return <div className="loading-state">Loading farmer data...</div>;
    if (farmers.length === 0) return <div className="empty-state">No farmer profiles found. Create a loan request to see them here.</div>;

    return (
        <div className="profiles-container">
            {/* List Sidebar */}
            <div className="card list-sidebar">
                <div className="list-header">
                    <h3>All Farmers</h3>
                    <span className="count-badge">8</span>
                </div>
                <div className="farmer-list">
                    {farmers.map(farmer => (
                        <div
                            key={farmer.id}
                            className={`list-item ${activeFarmerId === farmer.id ? 'active' : ''}`}
                            onClick={() => setActiveFarmerId(farmer.id)}
                        >
                            <div className={`app-initial initial-${farmer.risk.toLowerCase()}`}>
                                {farmer.initial}
                            </div>
                            <div className="item-info">
                                <h4>{farmer.name}</h4>
                                <p>{farmer.id} - {farmer.location}</p>
                            </div>
                            <span className={`status-badge status-${farmer.risk.toLowerCase()}`}>
                                {farmer.risk}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Details View */}
            <div className="details-view">
                <div className="card profile-header-card">
                    <div className="profile-header-top">
                        <div className="profile-identity">
                            <div className="large-initial">{activeFarmer.initial}</div>
                            <div className="profile-title">
                                <h2>{activeFarmer.name}</h2>
                                <p>{activeFarmer.id}</p>
                                <div className="tags">
                                    <span className={`status-badge status-${activeFarmer.risk.toLowerCase()}`}>{activeFarmer.risk}</span>
                                    <span className="pill-tag">{activeFarmer.location}</span>
                                    <span className="pill-tag">{activeFarmer.crop}</span>
                                </div>
                            </div>
                        </div>
                        <div className="trust-score-donut">
                            <div className="score-circle">
                                <span className="sc-val">{activeFarmer.score}</span>
                                <span className="sc-lbl">TRUST SCORE</span>
                            </div>
                        </div>
                    </div>

                    <div className="farm-details-grid">
                        <div className="detail-item">
                            <p className="d-label">LAND SIZE</p>
                            <p className="d-value">{activeFarmer.landSize}</p>
                        </div>
                        <div className="detail-item">
                            <p className="d-label">IRRIGATION TYPE</p>
                            <p className="d-value">{activeFarmer.irrigation}</p>
                        </div>
                        <div className="detail-item">
                            <p className="d-label">SOIL FERTILITY</p>
                            <p className="d-value">{activeFarmer.soil}</p>
                        </div>
                        <div className="detail-item">
                            <p className="d-label">YIELD STABILITY</p>
                            <p className="d-value">{activeFarmer.yield}</p>
                        </div>
                        <div className="detail-item">
                            <p className="d-label">RAINFALL DEVIATION</p>
                            <p className="d-value">{activeFarmer.rain}</p>
                        </div>
                        <div className="detail-item">
                            <p className="d-label">DEFAULT PROBABILITY</p>
                            <p className="d-value">{activeFarmer.defaultProb}</p>
                        </div>
                    </div>
                </div>

                <div className="card loan-history-card">
                    <div className="history-header">
                        <h3>Loan History</h3>
                        <span className="h-count">3 records</span>
                    </div>
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>LOAN AMOUNT</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{new Date(activeFarmer.date + 'Z').toLocaleDateString()}</td>
                                <td className="font-medium">₹{activeFarmer.loanAmount.toLocaleString()}</td>
                                <td>
                                    <span className={`status-badge pill-${activeFarmer.status.toLowerCase()}`}>
                                        {activeFarmer.status}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default FarmerProfiles;
