import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const LOGIN_ATTEMPTING = 0;
    const LOGIN_INVALID = 1;
    const LOGIN_ERROR = 2;
    const [loginState, setLoginState] = useState(LOGIN_ATTEMPTING);

    function create() {
        console.log('username: ', username);
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
                username, password
            })
        }).then(resp => {
            console.log(resp);
        }).catch(e => {
            console.log(e);
        })
    }

    function performLogin() {
        console.log('username: ', username);
        console.log('password: ', password);

        fetch('http://localhost:8000/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username, password
            })
        }).then(resp => {
            console.log(resp);
            if (resp.ok)
                return resp.json();
            throw new Error('login_invalid');
        }).then(resp => {
            console.log(resp);
            navigate('/');
        }).catch(e => {
            console.log(e);
            if (e.message === 'login_invalid')
                setLoginState(LOGIN_INVALID);
            else
                setLoginState(LOGIN_ERROR);
        })
    }

    return (
        <div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button onClick={create}>
                    Create
                </Button>
                <Button onClick={performLogin}>
                    Login
                </Button>
                {loginState === LOGIN_INVALID && <p class="text-danger">Login invalid.</p>}
                {loginState === LOGIN_ERROR && <p class="text-warning">Error during login, please try again.</p>}
            </Form>
        </div>
    );
};
