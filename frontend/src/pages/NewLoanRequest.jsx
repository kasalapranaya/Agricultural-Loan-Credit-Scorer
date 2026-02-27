import { useState } from 'react';
import './NewLoanRequest.css';

function NewLoanRequest() {

    const [formData, setFormData] = useState({
        farmerName: '',
        district: '',
        land_size: '',
        crop_type: '',
        soil_fertility_score: '',
        yield_stability_score: '',
        rainfall_deviation: '',
        loan_amount: '',
    });

    const [analysisResult, setAnalysisResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAnalyze = async () => {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        setAnalysisResult(data);
    };

    /* ---------- RISK MAPPING ---------- */

    /* ---------- RISK MAPPING ---------- */

    const riskRaw = analysisResult?.risk_category || '';

    let riskType = 'low'; // default green

    if (riskRaw === "High Risk") {
        riskType = 'high';
    }
    else if (riskRaw === "Medium Risk") {
        riskType = 'medium';
    }
    else if (riskRaw === "Low Risk") {
        riskType = 'low';
    }
    else if (riskRaw === "No Risk") {
        riskType = 'low';   // treat No Risk as green
    }
    /* ---------- DYNAMIC RISK FACTORS ---------- */

    const getRiskFactors = () => {
        if (!analysisResult) return [];

        if (riskType === 'high') {
            return [
                "High probability of default",
                "Unstable rainfall pattern",
                "Low yield stability score"
            ];
        }

        if (riskType === 'medium') {
            return [
                "Moderate loan-to-land ratio",
                "Seasonal yield variability"
            ];
        }

        if (riskType === 'very') {
            return [
                "Excellent yield stability",
                "Strong soil fertility metrics",
                "Very low default probability"
            ];
        }

        return [
            "Stable agricultural profile",
            "Healthy financial indicators"
        ];
    };

    return (
        <div className="new-loan-container">

            {/* FORM SECTION */}
            <div className="card form-card">
                <div className="form-header-bg">
                    <h2>Farmer & Loan Details</h2>
                    <p>Generate AI-based trust score</p>
                </div>

                <div className="loan-form">

                    <div className="form-row">
                        <div className="form-group">
                            <label>Farmer Name</label>
                            <input name="farmerName"
                                value={formData.farmerName}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>District</label>
                            <input name="district"
                                value={formData.district}
                                onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary"
                            onClick={handleAnalyze}>
                            Run AI Analysis
                        </button>
                    </div>

                </div>
            </div>

            {/* AI RESULT SECTION */}
            <div className="card ai-panel-card">

                {analysisResult && (
                    <>
                        <h4>AI Assessment Result</h4>

                        <div className="mega-score">
                            {analysisResult.trust_score}
                        </div>

                        <div className="score-progress-bg">
                            <div
                                className={`score-progress-fill bg-${riskType}`}
                                style={{ width: `${analysisResult.trust_score}%` }}
                            />
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            Default Probability:
                            {(analysisResult.default_probability * 100).toFixed(2)}%
                        </div>

                        <div style={{ marginTop: '0.8rem' }}
                            className={`pill pill-${riskType}`}>
                            {riskType.toUpperCase()} RISK
                        </div>

                        <div className="risk-factors-section">
                            <h4>Top Risk Factors</h4>
                            <ul>
                                {getRiskFactors().map((factor, index) => (
                                    <li key={index}>{factor}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="action-buttons-row">
                            <button className="btn-approve">Approve</button>
                            <button className="btn-review">Review</button>
                            <button className="btn-reject">Reject</button>
                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

export default NewLoanRequest;