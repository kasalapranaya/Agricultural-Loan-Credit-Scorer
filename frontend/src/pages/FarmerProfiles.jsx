import { useState } from 'react';
import './FarmerProfiles.css';

const farmersList = [
    { id: 'F-2024-001', initial: 'R', name: 'Ramesh Kumar Patel', location: 'Nashik', crop: 'Sugarcane', risk: 'LOW', score: 82, landSize: '4.5 Acres', irrigation: 'Drip Irrigation', soil: '7.8 / 10', yield: '8.1 / 10', rain: '-4.2%', defaultProb: '8.0%' },
    { id: 'F-2024-002', initial: 'S', name: 'Sunita Devi Sharma', location: 'Pune', crop: 'Wheat', risk: 'MEDIUM', score: 61, landSize: '2.1 Acres', irrigation: 'Canal', soil: '6.5 / 10', yield: '7.0 / 10', rain: '+2.1%', defaultProb: '31.0%' },
    { id: 'F-2024-003', initial: 'G', name: 'Gopal Singh Yadav', location: 'Amravati', crop: 'Cotton', risk: 'HIGH', score: 41, landSize: '8.0 Acres', irrigation: 'Borewell', soil: '4.5 / 10', yield: '5.2 / 10', rain: '-12.5%', defaultProb: '67.0%' },
    { id: 'F-2024-004', initial: 'P', name: 'Priya Bai Meena', location: 'Satara', crop: 'Soybean', risk: 'LOW', score: 78, landSize: '3.2 Acres', irrigation: 'Sprinkler', soil: '8.0 / 10', yield: '7.9 / 10', rain: '+5.0%', defaultProb: '12.0%' },
    { id: 'F-2024-005', initial: 'M', name: 'Manoj Kumar Verma', location: 'Nagpur', crop: 'Orange', risk: 'MEDIUM', score: 55, landSize: '5.7 Acres', irrigation: 'Drip Irrigation', soil: '6.8 / 10', yield: '6.5 / 10', rain: '-8.1%', defaultProb: '44.0%' },
];

const loanHistory = [
    { year: 2021, amount: '₹ 1,20,000', status: 'Repaid', statusColor: 'low', onTime: 'Yes' },
    { year: 2022, amount: '₹ 1,80,000', status: 'Repaid', statusColor: 'low', onTime: 'Yes' },
    { year: 2023, amount: '₹ 2,20,000', status: 'Active', statusColor: 'blue', onTime: 'Yes' },
];

function FarmerProfiles() {
    const [activeFarmerId, setActiveFarmerId] = useState('F-2024-001');
    const activeFarmer = farmersList.find(f => f.id === activeFarmerId) || farmersList[0];

    return (
        <div className="profiles-container">
            {/* List Sidebar */}
            <div className="card list-sidebar">
                <div className="list-header">
                    <h3>All Farmers</h3>
                    <span className="count-badge">8</span>
                </div>
                <div className="farmer-list">
                    {farmersList.map(farmer => (
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
                                <th>YEAR</th>
                                <th>LOAN AMOUNT</th>
                                <th>STATUS</th>
                                <th>ON TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanHistory.map((loan, i) => (
                                <tr key={i}>
                                    <td>{loan.year}</td>
                                    <td className="font-medium">{loan.amount}</td>
                                    <td>
                                        <span className={`status-badge status-${loan.statusColor}`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="text-green">✓ {loan.onTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default FarmerProfiles;
