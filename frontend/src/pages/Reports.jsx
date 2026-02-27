import { Download } from 'lucide-react';
import './Reports.css';

const reportsData = [
    { id: 'F-2024-001', initial: 'R', name: 'Ramesh Kumar Patel', district: 'Nashik', crop: 'Sugarcane', land: '4.5', score: 82, prob: '8.0%', risk: 'LOW', riskColor: 'low', irrigation: 'Drip Irrigation' },
    { id: 'F-2024-002', initial: 'S', name: 'Sunita Devi Sharma', district: 'Pune', crop: 'Wheat', land: '2.1', score: 61, prob: '31.0%', risk: 'MEDIUM', riskColor: 'medium', irrigation: 'Canal' },
    { id: 'F-2024-003', initial: 'G', name: 'Gopal Singh Yadav', district: 'Amravati', crop: 'Cotton', land: '8.0', score: 41, prob: '67.0%', risk: 'HIGH', riskColor: 'high', irrigation: 'Borewell' },
    { id: 'F-2024-004', initial: 'P', name: 'Priya Bai Meena', district: 'Satara', crop: 'Soybean', land: '3.2', score: 78, prob: '12.0%', risk: 'LOW', riskColor: 'low', irrigation: 'Sprinkler' },
    { id: 'F-2024-005', initial: 'M', name: 'Manoj Kumar Verma', district: 'Nagpur', crop: 'Orange', land: '5.7', score: 55, prob: '44.0%', risk: 'MEDIUM', riskColor: 'medium', irrigation: 'Drip Irrigation' },
    { id: 'F-2024-006', initial: 'K', name: 'Kavitha Reddy Nair', district: 'Solapur', crop: 'Sugarcane', land: '6.8', score: 88, prob: '5.0%', risk: 'LOW', riskColor: 'low', irrigation: 'Canal' },
    { id: 'F-2024-007', initial: 'A', name: 'Anil Bhosale Patil', district: 'Pune', crop: 'Jowar', land: '1.5', score: 36, prob: '74.0%', risk: 'HIGH', riskColor: 'high', irrigation: 'Rainfed' },
    { id: 'F-2024-008', initial: 'L', name: 'Lakshmi Devi Pillai', district: 'Nashik', crop: 'Grapes', land: '7.3', score: 71, prob: '28.0%', risk: 'MEDIUM', riskColor: 'medium', irrigation: 'Drip Irrigation' },
];

function Reports() {
    return (
        <div className="reports-container">
            <div className="card filters-card">
                <div className="filters-left">
                    <div className="filter-group">
                        <label>RISK LEVEL</label>
                        <select defaultValue="All Levels">
                            <option>All Levels</option>
                            <option>Low Risk</option>
                            <option>Medium Risk</option>
                            <option>High Risk</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>DISTRICT</label>
                        <select defaultValue="All Districts">
                            <option>All Districts</option>
                            <option>Nashik</option>
                            <option>Pune</option>
                            <option>Amravati</option>
                            <option>Nagpur</option>
                        </select>
                    </div>
                </div>

                <div className="filters-right">
                    <div className="summary-badges">
                        <span className="badge-total">8 records</span>
                        <span className="badge-low">L: 3</span>
                        <span className="badge-medium">M: 3</span>
                        <span className="badge-high">H: 2</span>
                    </div>
                    <button className="btn-primary export-btn">
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="card table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>FARMER ID <span className="sort-icon">↕</span></th>
                            <th>NAME <span className="sort-icon">↕</span></th>
                            <th>DISTRICT <span className="sort-icon">↕</span></th>
                            <th>CROP <span className="sort-icon">↕</span></th>
                            <th>LAND (AC) <span className="sort-icon">↕</span></th>
                            <th>TRUST SCORE <span className="sort-icon">↕</span></th>
                            <th>DEFAULT PROB. <span className="sort-icon">↕</span></th>
                            <th>RISK LEVEL <span className="sort-icon">↕</span></th>
                            <th>IRRIGATION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportsData.map((row, i) => (
                            <tr key={i}>
                                <td className="id-cell">{row.id}</td>
                                <td className="name-cell">
                                    <div className={`app-initial initial-${row.riskColor} small-initial`}>{row.initial}</div>
                                    {row.name}
                                </td>
                                <td>{row.district}</td>
                                <td>{row.crop}</td>
                                <td>{row.land}</td>
                                <td className="score-cell">
                                    <div className="score-bar-bg">
                                        <div className={`score-bar fill-${row.riskColor}`} style={{ width: `${row.score}%` }}></div>
                                    </div>
                                    <span className="score-num">{row.score}</span>
                                </td>
                                <td>{row.prob}</td>
                                <td>
                                    <span className={`status-badge status-${row.riskColor}`}>{row.risk}</span>
                                </td>
                                <td className="text-secondary">{row.irrigation}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="table-footer">
                    <p>Showing 8 of 8 records - Data as of February 2026</p>
                </div>
            </div>
        </div>
    );
}

export default Reports;
