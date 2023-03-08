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

    const [label, setLabel] = useState('');
    fetch('http://localhost:8000/images/label/' + filename, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Authorization': token
        }
    }).then(resp => {
        return resp.json();
    }).then(resp => {
        setLabel(resp['label']);
    }).catch(e => {
        console.log(e);
    })

    let image = null;
    fetch('http://localhost:8000/images/file/' + filename, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Authorization': token
        }
    }).then(resp => {
        return resp.blob();
    }).then(resp => {
        image = new Image();
        image.src = URL.createObjectURL(resp);
        image.onload = () => {
            image.width = 300 * (image.width / image.height);
            image.height = 300;
        }
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
        drawCanvas();
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
        let mat = cv.imread(image);

        for (let i = 0; i < points.length - 1; i += 1) {
            const p0 = new cv.Point(points[i][0], points[i][1])
            const p1 = new cv.Point(points[i+1][0], points[i+1][1])
            cv.line(mat, p0, p1, [130, 0, 0, 255], 1);
        }

        for(const p of points) {
            cv.circle(mat, new cv.Point(p[0], p[1]), 2, [255, 0, 0, 255], -1);
        }

        cv.imshow('canvasOutput', mat);
        mat.delete();
    }

    function submit() {
        console.log('submitting');
        console.log(points);
        console.log(JSON.stringify(points));
        fetch('http://localhost:8000/images/segmentation/' + filename, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'content-type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(points)
        }).then(resp => {
            console.log(resp)
        }).catch(e => {
            console.log(e);
        })
    }

    return (
        <div>
            <h2>Manual Image Segmentation</h2>
            <p>Image:</p>
            <canvas id="canvasOutput"></canvas>
            <p>Click to plot points. Create a contour around the main object with label: { label }</p>
            <button onClick={() => {points = []; drawCanvas();}}>Clear Points</button>
            <button onClick={submit}>Submit</button>
        </div>
    );
};
