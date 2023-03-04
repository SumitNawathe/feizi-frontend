import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

class Navigation extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Navbar bg="light">
                <Container>
                    <Navbar.Brand>Feizi Interview Application</Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default Navigation;
