import { OpenCvProvider, useOpenCv } from 'opencv-react';
import React, { useEffect, useState, componentDidMount } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { eraseCookie, getCookie } from '../cookies';

export default function Segmentation() {
    const {filename} = useParams();
    console.log('filename: ', filename);
    const navigate = useNavigate();
    const { loaded, cv } = useOpenCv();

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
        return resp.blob();
    }).then(resp => {
        console.log(resp);
        image = resp;
    }).catch(resp => {
        console.log(resp);
    });

    let pageLoaded = false;
    useEffect(() => {
        if (cv === null || pageLoaded) return;
        pageLoaded = true;
        (async () => {
            while (image === null)
                await new Promise(r => setTimeout(r, 1000));
            runCanvas();
        })();
    }, [cv]);

    function runCanvas() {
        console.log('runCanvas');
        let imgElement = document.getElementById('myimg');
        imgElement.onload = drawCanvas;
        imgElement.src = URL.createObjectURL(image);
        document.getElementById('canvasOutput').addEventListener('click', mouseCallback)
    }

    let points = [];
    
    function mouseCallback(e) {
        let rect = document.getElementById('canvasOutput').getClientRects()[0];
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        points.push([x, y]);
        drawCanvas();
    }

    function drawCanvas() {
        
        let imgElement = document.getElementById('myimg');
        console.log('drawCanvas cv: ', cv);
        let mat = cv.imread(imgElement);

        for (let i = 0; i < points.length - 1; i += 1) {
            const p0 = new cv.Point(points[i][0], points[i][1])
            const p1 = new cv.Point(points[i+1][0], points[i+1][1])
            cv.line(mat, p0, p1, [130, 0, 0, 255], 2);
        }

        for(const p of points) {
            cv.circle(mat, new cv.Point(p[0], p[1]), 5, [255, 0, 0, 255], -1);
        }

        cv.imshow('canvasOutput', mat);
        mat.delete();
    }

    // (async () => {
    //     while (true) {
    //         console.log(cv);
    //         await new Promise(r => setTimeout(r, 1000));
    //     }
    // })();

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
            <h2>Manual Image Segmentation</h2>
            <p>Original Image:</p>
            <img id="myimg" style={{height: 200, hidden: true}} alt="Image Tag"/>
            <p>Canvas:</p>
            <canvas id="canvasOutput"></canvas>
        </div>
    );
};
