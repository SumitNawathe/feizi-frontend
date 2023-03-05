import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { eraseCookie, getCookie } from '../cookies';

export default function ProfileInfo() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [filenames, setFilenames] = useState([]);

    const [imageError, setImageError] = useState(false);

    const [token, setToken] = useState(getCookie('auth-token'));

    const location = useLocation();
    useEffect(() => {
        setToken(getCookie('auth-token'));
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
                if (!resp.ok)
                    throw new Error();
                return resp.json();
            }).then(resp => {
                setUsername(resp['username']);
                setEmail(resp['email']);
                return fetch('http://localhost:8000/images/all_filenames', {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': '*',
                        'content-type': 'application/json',
                        'Authorization': token
                    }
                });
            }).then(resp => {
                if (!resp.ok)
                    throw new Error();
                return resp.json();
            }).then(resp => {
                setFilenames(resp);
            }).catch(e => {
                console.log(e);
            })
        } else {
            navigate('/');
        }
    }, [location])

    function performFileUpload() {
        const uploadForm = document.getElementById('upload-form');
        let formData = new FormData(uploadForm);
        const file = document.getElementById('file-upload').files[0];
        formData.append('file', file);
        fetch('http://localhost:8000/images/upload', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Authorization': token
            },
            body: formData
        }).then(resp => {
            console.log(resp);
            if (!resp.ok)
                throw new Error();
            window.location.reload();
        }).catch(e => {
            setImageError(true);
        })
    }

    return (
        <div>
            <h2>Profile Info</h2>
            <ul>
                <li>Username: { username }</li>
                <li>Email: { email }</li>
            </ul>

            <h4>Uploaded Images:</h4>
            {
                (filenames.length == 0) ? <p>No uploaded files to show</p> :
                <ul>{filenames.map((filename, index) => <li key={index}>{filename}</li>)}</ul>
            }

            <h4>Upload a file here:</h4>
            <form id="upload-form">
                <input type="file" id="file-upload" />
                <button onClick={performFileUpload} type="button">Submit</button>
            </form>
            { imageError && <p class="text-warning">Error during upload.</p>}
        </div>
    );
};
