import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
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
        const label = document.getElementById('image-label').value;
        console.log('label: ', label);
        if (label.length === 0)
            return;
        fetch('http://localhost:8000/images/upload/' + label, {
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
            <h2 style={{paddingTop: '20px'}}>Profile Info</h2>
            <ul>
                <li>Username: { username }</li>
                <li>Email: { email }</li>
            </ul>

            <h4 style={{paddingTop: '20px'}}>Uploaded Images:</h4>
            <p>Here are all of the images you have uploaded using the form below.</p>
            <p>Clicking on them will allow you to manually segment the image.</p>
            {
                (filenames.length == 0) ? <p>No uploaded files to show</p> :
                <ul>{filenames.map((filename, index) => <li key={index}><Link to={'/segmentation/'+filename}>{filename}</Link></li>)}</ul>
            }

            <h4 style={{paddingTop: '20px'}}>Upload a file here:</h4>
            <p>Please upload image files and accompanying labels for the primary object in view.</p>
            <p>The image and label will be saved in our database under your profile, along with a distorted copy.</p>
            <form id="upload-form">
                <p><input type="file" id="file-upload" /></p>
                <p>Image label: <input type="text" id="image-label" /></p>
                <p><button onClick={performFileUpload} type="button">Upload</button></p>
            </form>
            { imageError && <p class="text-warning">Error during upload.</p>}
        </div>
    );
};
