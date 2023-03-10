import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { setCookie } from '../cookies';

export default function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [signupError, setSignupError] = useState(false);

    function performSignup() {
        console.log('username: ', username);
        console.log('email: ', email);
        console.log('password: ', password);

        fetch('http://localhost:8000/users/create', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username, email, password
            })
        }).then(resp => {
            console.log(resp);
            if (!resp.ok)
                throw new Error();
            navigate('/login');
        }).catch(e => {
            console.log(e);
            setSignupError(true);
        });
    }

    return (
        <div>
            <h2 style={{paddingTop: '20px'}}>Sign Up</h2>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button onClick={performSignup}>
                    Sign Up
                </Button>
                {signupError && <p class="text-warning">Error signing up, please try again.</p>}
            </Form>
        </div>
    );
};
