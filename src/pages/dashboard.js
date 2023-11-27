import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../layout/Nav';
import SideBar from '../layout/SideBar';
import Content from '../layout/Content';
import Footer from '../layout/Footer';
function Dashboard() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

        if (!isLoggedIn) {
            navigate('/login');
        } else {
            const storedUsername = sessionStorage.getItem('userName');
            setUsername(storedUsername);
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        navigate('/login');
    };

    return (
        <div>
            <Nav onLogout={handleLogout} />
            <SideBar />
            <Content username={username} />
            <Footer />
        </div>
    );
}

export default Dashboard;
