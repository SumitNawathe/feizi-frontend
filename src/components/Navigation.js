import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { eraseCookie, getCookie } from '../cookies';

export default function Navigation() {
    const [token, setToken] = useState('');

    const location = useLocation();
    useEffect(() => {
        setToken(getCookie('auth-token'));
    }, [location])

    const navigate = useNavigate();
    function performLogout() {
        eraseCookie('auth-token');
        setToken(getCookie('auth-token'));
        navigate('/');
    }

    if (token) {
        return (
            <Navbar bg="light">
                <Container>
                    <Navbar.Brand>Feizi Interview Application</Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <div className="nav-link"><NavLink to="/">Home</NavLink></div>
                            <div className="nav-link"><NavLink to="/profile-info">Profile Info</NavLink></div>
                            <div className="nav-link" onClick={performLogout}>Logout</div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    } else {
        return (
            <Navbar bg="light">
                <Container>
                    <Navbar.Brand>Feizi Interview Application</Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <div className="nav-link"><NavLink to="/">Home</NavLink></div>
                            <div className="nav-link"><NavLink to="/login">Login</NavLink></div>
                            <div className="nav-link"><NavLink to="/signup">Sign Up</NavLink></div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
};
