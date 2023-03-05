import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { eraseCookie, getCookie } from '../cookies';

export default function ProfileInfo() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [token, setToken] = useState(getCookie('auth-token'));

    const location = useLocation();
    useEffect(() => {
        setToken(getCookie('auth-token'));
        console.log('ProfileInfo token: ', token);
        if (token) {
            fetch('http://localhost:8000/users/info', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'content-type': 'application/json',
                    'Authorization': token
                }
            }).then(resp => {
                console.log(resp);
                if (!resp.ok)
                    throw new Error();
                return resp.json();
            }).then(resp => {
                console.log(resp);
                setUsername(resp['username']);
                setEmail(resp['email']);
            }).catch(e => {
                console.log(e);
            })
        } else {
            navigate('/');
        }
    }, [location])

    return (
        <div>
            <h2>Profile Info</h2>
            <ul>
                <li>Username: { username }</li>
                <li>Email: { email }</li>
            </ul>
        </div>
    );
};
