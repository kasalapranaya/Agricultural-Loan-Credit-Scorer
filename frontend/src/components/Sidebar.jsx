import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FilePlus, BarChart2, Leaf, ChevronLeft } from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profiles', label: 'Farmer Profiles', icon: Users },
    { path: '/new-loan', label: 'New Loan Request', icon: FilePlus },
    { path: '/reports', label: 'Reports', icon: BarChart2 },
];

function Sidebar() {
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

            <div className="user-profile">
                <div className="avatar">D</div>
                <div className="user-info">
                    <p className="user-role">Sr. Loan Officer</p>
                    <p className="user-name">DHARANI</p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
