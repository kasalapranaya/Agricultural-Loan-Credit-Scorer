import { useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './Header.css';

const PAGE_TITLES = {
    '/dashboard': 'Dashboard',
    '/profiles': 'Farmer Profiles',
    '/new-loan': 'New Loan Request',
    '/reports': 'Reports',
};

function Header() {
    const location = useLocation();
    const title = PAGE_TITLES[location.pathname] || 'Dashboard';

    // Format date like "Saturday, 28 February 2026"
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const today = new Date().toLocaleDateString('en-GB', dateOptions);

    return (
        <header className="header">
            <div className="header-title">
                <h1>{title}</h1>
                <p className="header-date">{today}</p>
            </div>

            <div className="header-actions">
                <div className="system-status">
                    <span className="status-dot"></span>
                    <span>System Online</span>
                </div>
            </div>
        </header>
    );
}

export default Header;
