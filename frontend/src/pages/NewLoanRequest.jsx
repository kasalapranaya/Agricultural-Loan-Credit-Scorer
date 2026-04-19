import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewLoanRequest.css';

function NewLoanRequest() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        farmerName: '',
        district: '',
        land_size: '',
        crop_type: '',
        irrigation_type: '',
        soil_fertility_score: '',
        yield_stability_score: '',
        rainfall_deviation: '',
        loan_amount: '',
        interest_rate: '',
    });

    const telanganaDistricts = [
        "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
        "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
        "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar",
        "Mancherial", "Medak", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool",
        "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
        "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet",
        "Vikarabad", "Wanaparthy", "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"
    ];

    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [applicationId, setApplicationId] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [hasSaved, setHasSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...formData, [name]: value };
        
        // Calculate interest rate as 8% of loan amount
        if (name === 'loan_amount') {
            const amount = parseFloat(value) || 0;
            updatedData.interest_rate = (amount * 0.08).toFixed(2);
        }
        
        setFormData(updatedData);
        if (hasSaved) {
            setHasSaved(false);
            setAnalysisResult(null);
            setUpdateStatus(null);
            setApplicationId(null);
        }
        if (validationError) {
            setValidationError('');
        }
    };

    const handleReset = () => {
        setFormData({
            farmerName: '',
            district: '',
            land_size: '',
            crop_type: '',
            irrigation_type: '',
            soil_fertility_score: '',
            yield_stability_score: '',
            rainfall_deviation: '',
            loan_amount: '',
            interest_rate: '',
        });
        setAnalysisResult(null);
        setValidationError('');
        setApplicationId(null);
        setUpdateStatus(null);
        setHasSaved(false);
    };

    const saveApplication = async (result) => {
        try {
            const appData = {
                ...formData,
                trust_score: result.trust_score,
                risk_category: result.risk_category,
                status: 'Pending'
            };
            const response = await fetch('/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appData)
            });
            const data = await response.json();
            if (data.id) {
                setApplicationId(data.id);
                setHasSaved(true);
            }
        } catch (error) {
            console.error("Failed to save application:", error);
        }
    };

    const handleAnalyze = async () => {
        setValidationError('');
        
        // Validation check
        const emptyFields = Object.entries(formData).filter(([key, value]) => !value.toString().trim());
        if (emptyFields.length > 0) {
            setValidationError('Please fill in all the required fields before running the AI analysis.');
            return;
        }

        if (parseFloat(formData.land_size) <= 0) {
            setValidationError('Land size must be greater than 0.');
            return;
        }

        if (parseFloat(formData.loan_amount) < 0) {
            setValidationError('Loan amount cannot be negative.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            setAnalysisResult(data);
            if (!data.error) {
                await saveApplication(data);
            }
        } catch (error) {
            console.error("Analysis failed:", error);
            setValidationError('Connection error. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!applicationId) return;
        
        try {
            const response = await fetch(`/applications/${applicationId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (response.ok) {
                setUpdateStatus(newStatus);
                if (newStatus === 'Approved') {
                    // Navigate visually to tracking to prove it's added
                    setTimeout(() => navigate('/tracking'), 1500); // 1.5s delay to see button update
                }
            }
        } catch (error) {

            console.error("Failed to update status:", error);
        }
    };

    /* ---------- RISK MAPPING ---------- */
    const riskRaw = analysisResult?.risk_category || '';
    let riskType = 'low';

    if (riskRaw === "High Risk") {
        riskType = 'high';
    } else if (riskRaw === "Moderate Risk" || riskRaw === "Medium Risk") {
        riskType = 'medium';
    } else {
        riskType = 'low';
    }

    /* ---------- DYNAMIC RISK FACTORS ---------- */
    const getRiskFactors = () => {
        if (!analysisResult) return [];

        if (riskType === 'high') {
            return [
                "High probability of default",
                "Unstable rainfall pattern",
                "Low yield stability score",
                "Large loan relative to profile"
            ];
        }

        if (riskType === 'medium') {
            return [
                "Moderate loan-to-land ratio",
                "Seasonal yield variability",
                "Rainfall deviation needs monitoring"
            ];
        }

        return [
            "Stable agricultural profile",
            "Healthy financial indicators",
            "Good soil fertility metrics"
        ];
    };

    return (
        <div className="new-loan-container">

            {/* FORM COLUMN (LEFT) */}
            <div className="form-column">
                <div className="card form-card-modern">
                    <div className="form-header-dark">
                        <h2>Farmer & Loan Details</h2>
                        <p>Enter the applicant's data to generate an AI trust score</p>
                    </div>

                    <div className="loan-form-content">
                        {/* APPLICANT INFORMATION */}
                        <div className="form-section-header">APPLICANT INFORMATION</div>
                        
                        {validationError && (
                            <div className="validation-error-banner">
                                <span>⚠️</span> {validationError}
                            </div>
                        )}

                        <div className="form-row-grid">
                            <div className="form-group-modern">
                                <label>FARMER NAME <span className="star">*</span></label>
                                <input
                                    name="farmerName"
                                    placeholder="Enter farmer name"
                                    value={formData.farmerName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group-modern">
                                <label>DISTRICT <span className="star">*</span></label>
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                >
                                    <option value="">Select District</option>
                                    {telanganaDistricts.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* FARM DETAILS */}
                        <div className="form-section-header">FARM DETAILS</div>
                        <div className="form-row-grid">
                            <div className="form-group-modern">
                                <label>LAND SIZE (ACRES) <span className="star">*</span></label>
                                <input
                                    name="land_size"
                                    type="number"
                                    placeholder="e.g. 4.5"
                                    value={formData.land_size}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group-modern">
                                <label>CROP TYPE <span className="star">*</span></label>
                                <select
                                    name="crop_type"
                                    value={formData.crop_type}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Crop</option>
                                    <option value="Rice">Rice</option>
                                    <option value="Wheat">Wheat</option>
                                    <option value="Cotton">Cotton</option>
                                    <option value="Soybean">Soybean</option>
                                    <option value="Maize">Maize</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row-grid">
                            <div className="form-group-modern">
                                <label>IRRIGATION TYPE <span className="star">*</span></label>
                                <select
                                    name="irrigation_type"
                                    value={formData.irrigation_type}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Irrigation</option>
                                    <option value="Drip">Drip</option>
                                    <option value="Sprinkler">Sprinkler</option>
                                    <option value="Flood">Flood</option>
                                    <option value="Rain-fed">Rain-fed</option>
                                </select>
                            </div>
                            <div className="form-group-modern">
                                <label>SOIL FERTILITY SCORE (0-100) <span className="star">*</span></label>
                                <input
                                    name="soil_fertility_score"
                                    type="number"
                                    placeholder="e.g. 80"
                                    value={formData.soil_fertility_score}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row-grid">
                            <div className="form-group-modern">
                                <label>YIELD STABILITY SCORE (0-100) <span className="star">*</span></label>
                                <input
                                    name="yield_stability_score"
                                    type="number"
                                    placeholder="e.g. 75"
                                    value={formData.yield_stability_score}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group-modern">
                                <label>RAINFALL DEVIATION (%) <span className="star">*</span></label>
                                <input
                                    name="rainfall_deviation"
                                    type="number"
                                    placeholder="e.g. 14"
                                    value={formData.rainfall_deviation}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row-grid">
                            <div className="form-group-modern">
                                <label>LOAN AMOUNT (₹) <span className="star">*</span></label>
                                <input
                                    name="loan_amount"
                                    type="number"
                                    placeholder="e.g. 2600000"
                                    value={formData.loan_amount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-footer-actions">
                            <button 
                    className="btn-ai-analyze" 
                    onClick={handleAnalyze} 
                    disabled={loading || hasSaved}
                >
                    {loading ? 'Analyzing...' : (hasSaved ? 'Analysis Complete' : <><span>⚡</span> Run AI Analysis</>)}
                </button>
                            <button className="btn-reset" onClick={handleReset}>Reset</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI RESULT COLUMN (RIGHT) */}
            <div className="result-column">
                <div className="card result-card-modern">
                    {analysisResult ? (
                        <div className="ai-assessment-container">
                            {analysisResult.error ? (
                                <div className="error-display">
                                    <h4 className="error-title">Analysis Failed</h4>
                                    <p className="error-message">{analysisResult.error}</p>
                                    <p className="error-hint">Make sure the backend is running with all dependencies (e.g., using the virtual environment).</p>
                                </div>
                            ) : (
                                <>
                                    <div className="ai-header-row">
                                        <div>
                                            <h4 className="ai-label">AI ASSESSMENT RESULT</h4>
                                            <h3 className="farmer-result-name">{analysisResult.farmer_name}</h3>
                                        </div>
                                        <div className={`risk-badge badge-${riskType}`}>
                                            {riskType.toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="score-viz-section">
                                        <div className="gauge-outer">
                                            <div className="gauge-inner">
                                                <span className="big-score">{Math.round(analysisResult.trust_score)}</span>
                                                <span className="score-subtext">TRUST SCORE / 100</span>
                                            </div>
                                            <svg className="gauge-svg" viewBox="0 0 100 100">
                                                <circle className="gauge-bg" cx="50" cy="50" r="45" />
                                                <circle
                                                    className={`gauge-fill fill-${riskType}`}
                                                    cx="50" cy="50" r="45"
                                                    style={{ strokeDasharray: `${analysisResult.trust_score * 2.82} 282` }}
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="metrics-grid">
                                        <div className="metric-item">
                                            <span className="m-label">DEFAULT PROBABILITY</span>
                                            <span className="m-value">{(analysisResult.default_probability * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="metric-item">
                                            <span className="m-label">RISK LEVEL</span>
                                            <div className={`risk-pill pill-${riskType}`}>
                                                {riskType.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* INTEREST RATE SECTION */}
                                    <div className="interest-rate-section">
                                        <h4 className="factors-title">RATE OF INTEREST</h4>
                                        <div className="interest-rate-display">
                                            {riskType === 'low' ? (
                                                <div className="interest-rate-single">
                                                    <span className="interest-rate-value">{formData.interest_rate}₹</span>
                                                    <span className="interest-rate-label">(8% of loan amount)</span>
                                                </div>
                                            ) : (
                                                <div className="interest-rate-range">
                                                    <div className="range-item">
                                                        <span className="range-label">Minimum Rate</span>
                                                        <span className="range-amount">{(parseFloat(formData.loan_amount || 0) * 0.10).toFixed(2)}₹</span>
                                                        <span className="range-percentage">(10%)</span>
                                                    </div>
                                                    <div className="range-divider"></div>
                                                    <div className="range-item">
                                                        <span className="range-label">Maximum Rate</span>
                                                        <span className="range-amount">{(parseFloat(formData.loan_amount || 0) * 0.15).toFixed(2)}₹</span>
                                                        <span className="range-percentage">(15%)</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {analysisResult.recommended_loan_range && (
                                        <div className="recommendation-section">
                                            <div className="recommendation-header">
                                                <h4 className="factors-title">LOAN RECOMMENDATION</h4>
                                                {analysisResult.payback_duration_months && (
                                                    <div className="payback-badge">
                                                        <span>{analysisResult.payback_duration_months} Months Payback</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="range-container">
                                                <div className="range-item">
                                                    <span className="range-label">Minimum</span>
                                                    <span className="range-amount">₹{analysisResult.recommended_loan_range.min.toLocaleString()}</span>
                                                </div>
                                                <div className="range-divider"></div>
                                                <div className="range-item">
                                                    <span className="range-label">Maximum</span>
                                                    <span className="range-amount">₹{analysisResult.recommended_loan_range.max.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="risk-factors-section">
                                        <h4 className="factors-title">TOP RISK FACTORS</h4>
                                        <ul className="factors-list">
                                            {getRiskFactors().map((factor, index) => (
                                                <li key={index} className="factor-item">
                                                    <span className="bullet">•</span> {factor}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="decision-buttons">
                                        <button 
                                            className={`btn-decision approve ${updateStatus === 'Approved' ? 'active' : ''}`}
                                            onClick={() => handleStatusChange('Approved')}
                                            disabled={!!updateStatus}
                                        >
                                            {updateStatus === 'Approved' ? '✓ Approved' : '✓ Approve'}
                                        </button>
                                        <button 
                                            className={`btn-decision review ${updateStatus === 'Pending' ? 'active' : ''}`}
                                            onClick={() => handleStatusChange('Pending')}
                                            disabled={!!updateStatus}
                                        >
                                            {updateStatus === 'Pending' ? '... Reviewed' : '... Review'}
                                        </button>
                                        <button 
                                            className={`btn-decision reject ${updateStatus === 'Rejected' ? 'active' : ''}`}
                                            onClick={() => handleStatusChange('Rejected')}
                                            disabled={!!updateStatus}
                                        >
                                            {updateStatus === 'Rejected' ? '✗ Rejected' : '✗ Reject'}
                                        </button>
                                    </div>
                                    {updateStatus && (
                                        <div className="status-feedback">
                                            Status updated to <strong>{updateStatus}</strong>. View details in Dashboard.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="empty-result-state">
                            <div className="empty-icon">🤖</div>
                            <h3>Ready for Analysis</h3>
                            <p>Enter farmer data and click "Run AI Analysis" to see the credit score and risk assessment.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default NewLoanRequest;
