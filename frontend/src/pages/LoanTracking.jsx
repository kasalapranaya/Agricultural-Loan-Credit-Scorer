import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import './LoanTracking.css';

function LoanTracking() {
    const [trackedLoans, setTrackedLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPaybackMonths = (crop) => {
        const rules = {
            'Rice': 12, 'Wheat': 10, 'Cotton': 15, 'Sugarcane': 18, 
            'Maize': 8, 'Soybean': 9, 'Orange': 24, 'Grapes': 12, 'Jowar': 10
        };
        return rules[crop] || 12;
    };

    const calculateDaysRemaining = (dueDate) => {
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    useEffect(() => {
        const fetchTrackingData = async () => {
            try {
                // Fetch all applications
                const res = await fetch(`/applications?t=${Date.now()}`, { cache: 'no-store' });
                const data = await res.json();
                
                // Only show Approved loans
                const tracked = data.filter(app => 
                    app.status === 'Approved'
                );

                const processed = tracked.map(app => {
                    const months = getPaybackMonths(app.crop_type);
                    const startDate = new Date(app.created_at + 'Z');
                    
                    const dueDate = new Date(startDate);
                    dueDate.setMonth(dueDate.getMonth() + months);
                    
                    const daysRemaining = calculateDaysRemaining(dueDate);
                    
                    // Financials: 8% annual interest
                    const annualInterestRate = 0.08;
                    const estimatedInterest = app.loan_amount * annualInterestRate * (months / 12);
                    const totalPayable = app.loan_amount + estimatedInterest;

                    // Simple progress calculation based on time
                    const totalDays = Math.ceil((dueDate - startDate) / (1000 * 60 * 60 * 24));
                    const progress = 100 - ((daysRemaining / totalDays) * 100);

                    // Progress style
                    let statusColor = '#16a34a'; // Green
                    if (daysRemaining < 30) statusColor = '#dc2626'; // Red
                    else if (daysRemaining < 60) statusColor = '#f59e0b'; // Yellow

                    return {
                        id: `APP-${app.id.toString().padStart(3, '0')}`,
                        name: app.farmer_name,
                        initial: app.farmer_name.charAt(0).toUpperCase(),
                        crop: app.crop_type,
                        amount: app.loan_amount,
                        interest: estimatedInterest,
                        totalPayable: totalPayable,
                        creditedDate: startDate.toLocaleDateString(),
                        paybackMonths: months,
                        dueDate: dueDate.toLocaleDateString(),
                        daysRemaining,
                        progress: Math.max(0, Math.min(100, progress)),
                        statusColor
                    };
                });
                
                setTrackedLoans(processed);
            } catch (error) {
                console.error("Failed to fetch tracking data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrackingData();
    }, []);

    if (loading) return <div className="loading-state">Loading tracking data...</div>;

    return (
        <div className="tracking-container">
            <div className="card overview-card">
                <div className="overview-header">
                    <h2>Active Loan Tracking</h2>
                    <span className="subtitle">Monitoring {trackedLoans.length} active accepted loans</span>
                </div>
                
                <div className="tracking-stats">
                    <div className="t-stat">
                        <div className="t-icon bg-green-light"><CheckCircle size={24} color="#16a34a" /></div>
                        <div>
                            <h4>Total Active</h4>
                            <p>{trackedLoans.length} Loans</p>
                        </div>
                    </div>
                    <div className="t-stat">
                        <div className="t-icon bg-blue-light"><Calendar size={24} color="#2563eb" /></div>
                        <div>
                            <h4>Principal Issued</h4>
                            <p>₹{trackedLoans.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                    </div>
                    <div className="t-stat animate-delay-1">
                        <div className="t-icon" style={{ background: '#fef3c7' }}><Clock size={24} color="#d97706" /></div>
                        <div>
                            <h4>Expected Return</h4>
                            <p>₹{trackedLoans.reduce((sum, loan) => sum + loan.totalPayable, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card list-card">
                {trackedLoans.length === 0 ? (
                    <div className="empty-state">No accepted loans found to track.</div>
                ) : (
                    <table className="tracking-table">
                        <thead>
                            <tr>
                                <th>BORROWER</th>
                                <th>PRINCIPAL</th>
                                <th>INTEREST (8%)</th>
                                <th>TOTAL PAYABLE</th>
                                <th>DATE CREDITED</th>
                                <th>PAYBACK TIME</th>
                                <th>TIME REMAINING</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trackedLoans.map((loan, idx) => (
                                <tr key={idx} className="interactive-row">
                                    <td className="borrower-cell">
                                        <div className="app-initial initial-low small-initial">{loan.initial}</div>
                                        <div>
                                            <span className="b-name">{loan.name}</span>
                                            <span className="b-crop">{loan.crop}</span>
                                        </div>
                                    </td>
                                    <td className="amount-cell">₹{loan.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="text-secondary">+₹{loan.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="total-payable-cell">₹{loan.totalPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td>{loan.creditedDate}</td>
                                    <td>{loan.paybackMonths} Months</td>
                                    <td>
                                        <div className="time-remaining" style={{ color: loan.statusColor }}>
                                            <Clock size={14} />
                                            <span>
                                                {loan.daysRemaining > 30 
                                                    ? `${Math.floor(loan.daysRemaining / 30)} mo ${loan.daysRemaining % 30} d` 
                                                    : `${loan.daysRemaining} days`}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="progress-container">
                                            <div className="progress-track">
                                                <div 
                                                    className="progress-fill" 
                                                    style={{ width: `${loan.progress}%`, background: loan.statusColor }}
                                                ></div>
                                            </div>
                                            <span className="progress-text" style={{ color: loan.statusColor }}>Active</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default LoanTracking;
