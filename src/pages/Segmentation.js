import React, { useEffect, useState, componentDidMount } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { eraseCookie, getCookie } from '../cookies';

export default function ProfileInfo() {
    const navigate = useNavigate();

    const { filename } = useParams();
    console.log('filename: ', filename);

    const [token, setToken] = useState(getCookie('auth-token'));
    
    let image = null;
    fetch('http://localhost:8000/images/' + filename, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Authorization': token
        }
    }).then(resp => {
        console.log(resp);
        image = resp;
    }).catch(resp => {
        console.log(resp);
    });

    // let componentLoaded = false;
    // useEffect(() => {
    //     if (componentLoaded) return;
    //     componentLoaded = true;

    //     console.log('loaded');
    //     cv.imread(null);
    //     console.log('hi');
    // })

    // const location = useLocation();
    // useEffect(() => {
    //     setToken(getCookie('auth-token'));
    //     if (token) {
    //         fetch('http://localhost:8000/images/' + filename, {
    //             method: 'GET',
    //             mode: 'cors',
    //             headers: {
    //                 'Access-Control-Allow-Origin': '*',
    //                 'Access-Control-Allow-Headers': '*',
    //                 'Authorization': token
    //             }
    //         }).then(resp => {
    //             if (!resp.ok)
    //                 throw new Error();
    //             return resp.json();
    //         }).then(resp => {
    //             setUsername(resp['username']);
    //             setEmail(resp['email']);
    //             return fetch('http://localhost:8000/images/all_filenames', {
    //                 method: 'GET',
    //                 mode: 'cors',
    //                 headers: {
    //                     'Access-Control-Allow-Origin': '*',
    //                     'Access-Control-Allow-Headers': '*',
    //                     'content-type': 'application/json',
    //                     'Authorization': token
    //                 }
    //             });
    //         }).then(resp => {
    //             if (!resp.ok)
    //                 throw new Error();
    //             return resp.json();
    //         }).then(resp => {
    //             setFilenames(resp);
    //         }).catch(e => {
    //             console.log(e);
    //         })
    //     } else {
    //         navigate('/');
    //     }
    // }, [location]);

    return (
        <div>
            <script src="opencv.js" type="text/javascript"></script>
            <h2>Manual Image Segmentation</h2>
        </div>
    );
};
