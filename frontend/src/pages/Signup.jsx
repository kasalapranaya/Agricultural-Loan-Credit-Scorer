import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Briefcase, Leaf, AlertCircle } from 'lucide-react';
import './Auth.css';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Loan Officer'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signup(formData.name, formData.email, formData.password, formData.role);
            if (result.success) {
                navigate('/login');
            } else {
                setError(result.error || 'Failed to register');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '480px' }}>
                <div className="auth-header">
                    <div className="logo-icon">
                        <Leaf size={24} color="#2ecc71" />
                    </div>
                    <h1>Create Account</h1>
                    <p>Register for Agricultural Loan Scoring Portal</p>
                </div>

                <div className="auth-content">
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>FULL NAME</label>
                            <div className="input-wrapper">
                                <User size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>EMAIL ADDRESS</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="e.g. name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>PASSWORD</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Choose a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>DESIGNATION / ROLE</label>
                            <div className="input-wrapper">
                                <Briefcase size={18} />
                                <select 
                                    name="role" 
                                    value={formData.role} 
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Loan Officer">Sr. Loan Officer</option>
                                    <option value="Manager">Regional Manager</option>
                                    <option value="Admin">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="auth-btn"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </form>
                </div>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
