import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    const navStyle = ({ isActive }) => ({
        color: isActive ? 'red' : 'black',
        fontWeight: isActive ? 'bold' : 'normal',
        marginRight: '15px',
        textDecoration: 'none'
    });

    return (
        <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
            <NavLink to="/" style={navStyle} end>
                Trang chủ
            </NavLink>
            <NavLink to="/questions" style={navStyle}>
                Ngân hàng câu hỏi
            </NavLink>
            <NavLink to="/history" style={navStyle}>
                Lịch sử
            </NavLink>
        </nav>
    );
};

export default NavBar;