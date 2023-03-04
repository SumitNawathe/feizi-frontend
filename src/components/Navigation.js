import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
    return (
        <Navbar bg="light">
            <Container>
                <Navbar.Brand>Feizi Interview Application</Navbar.Brand>
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link><NavLink to="/">Home</NavLink></Nav.Link>
                        <Nav.Link><NavLink to="/login">Login</NavLink></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
