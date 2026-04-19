import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import './Reports.css';

function Reports() {
    const [allReports, setAllReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRisk, setFilterRisk] = useState('All Levels');
    const [filterDistrict, setFilterDistrict] = useState('All Districts');
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filterRisk, filterDistrict, allReports]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await fetch('/applications');
            const data = await response.json();
            
            const mapped = data.map(app => {
                const risk_raw = (app.risk_category || 'low').toUpperCase();
                const riskColor = risk_raw.includes('HIGH') ? 'high' : (risk_raw.includes('MEDIUM') ? 'medium' : 'low');
                const riskPill = riskColor.toUpperCase();
                
                return {
                    id: `APP-${app.id.toString().padStart(3, '0')}`,
                    initial: app.farmer_name.charAt(0).toUpperCase(),
                    name: app.farmer_name,
                    district: app.district,
                    crop: app.crop_type,
                    land: app.land_size.toString(),
                    score: Math.round(app.trust_score),
                    prob: riskColor === 'high' ? 'High' : (riskColor === 'medium' ? 'Medium' : 'Low'),
                    risk: riskPill,
                    riskColor: riskColor,
                    irrigation: app.irrigation_type || 'Unknown',
                    status: app.status,
                    date: app.created_at
                };
            });

            setAllReports(mapped);
            
            // Extract unique districts
            const uniqueDistricts = [...new Set(mapped.map(r => r.district))].sort();
            setDistricts(uniqueDistricts);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...allReports];
        
        if (filterRisk !== 'All Levels') {
            const riskMap = { 'Low Risk': 'low', 'Medium Risk': 'medium', 'High Risk': 'high' };
            result = result.filter(r => r.riskColor === riskMap[filterRisk]);
        }
        
        if (filterDistrict !== 'All Districts') {
            result = result.filter(r => r.district === filterDistrict);
        }
        
        setFilteredReports(result);
    };

    const handleExportCSV = () => {
        const headers = ["Farmer ID", "Date", "Name", "District", "Crop", "Land Size (Acres)", "Trust Score", "Default Probability", "Risk Level", "Irrigation", "Status"];
        const rows = filteredReports.map(r => [
            r.id, 
            new Date(r.date + 'Z').toLocaleDateString(),
            r.name, 
            r.district, 
            r.crop, 
            r.land, 
            r.score, 
            r.prob, 
            r.risk, 
            r.irrigation, 
            r.status
        ]);
        
        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'loan_applications_report.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const stats = {
        total: filteredReports.length,
        low: filteredReports.filter(r => r.riskColor === 'low').length,
        medium: filteredReports.filter(r => r.riskColor === 'medium').length,
        high: filteredReports.filter(r => r.riskColor === 'high').length
    };

    if (loading) return <div className="loading-state">Loading reports...</div>;

    return (
        <div className="reports-container">
            <div className="card filters-card">
                <div className="filters-left">
                    <div className="filter-group">
                        <label>RISK LEVEL</label>
                        <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                            <option>All Levels</option>
                            <option>Low Risk</option>
                            <option>Medium Risk</option>
                            <option>High Risk</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>DISTRICT</label>
                        <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)}>
                            <option>All Districts</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                <div className="filters-right">
                    <div className="summary-badges">
                        <span className="badge-total">{stats.total} records</span>
                        <span className="badge-low">L: {stats.low}</span>
                        <span className="badge-medium">M: {stats.medium}</span>
                        <span className="badge-high">H: {stats.high}</span>
                    </div>
                    <button className="btn-primary export-btn" onClick={handleExportCSV}>
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
                            <th>DATE <span className="sort-icon">↕</span></th>
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
                        {filteredReports.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="empty-table">No matching records found.</td>
                            </tr>
                        ) : (
                            filteredReports.map((row, i) => (
                            <tr key={i}>
                                <td className="id-cell">{row.id}</td>
                                <td className="text-secondary">{new Date(row.date + 'Z').toLocaleDateString()}</td>
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
                        )))}
                    </tbody>
                </table>

                <div className="table-footer">
                    <p>Showing {filteredReports.length} of {allReports.length} records - Data as of March 2026</p>
                </div>
            </div>
        </div>
    );
}

export default Reports;
