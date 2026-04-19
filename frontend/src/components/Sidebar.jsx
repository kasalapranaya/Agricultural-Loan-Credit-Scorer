import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FilePlus, BarChart2, Leaf, ChevronLeft, LogOut, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profiles', label: 'Farmer Profiles', icon: Users },
    { path: '/new-loan', label: 'New Loan Request', icon: FilePlus },
    { path: '/tracking', label: 'Loan Tracking', icon: TrendingUp },
    { path: '/reports', label: 'Reports', icon: BarChart2 },
];

function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-icon">
                        <Leaf size={20} color="#2ecc71" />
                    </div>
                    <div className="logo-text">
                        <h2>AgriTrust</h2>
                        <span>LOAN SCORING</span>
                    </div>
                </div>
                <button className="collapse-btn">
                    <ChevronLeft size={16} />
                </button>
            </div>

            <div className="nav-section">
                <p className="nav-label">NAVIGATION</p>
                <nav className="nav-menu">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
                    <div className="user-info">
                        <p className="user-role">{user?.role || 'User'}</p>
                        <p className="user-name">{user?.name || 'Unknown'}</p>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
