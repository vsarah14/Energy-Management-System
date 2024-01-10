import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import axios from 'axios';

const Login = (props) => {

    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();
    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    const onButtonClick = async (e) => {
        e.preventDefault();

        setUsernameError("");
        setPasswordError("");

        if("" === username){
            setUsernameError("Please enter your email")
            return
        }

        if("" === password){
            setPasswordError("Please enter your password")
            return
        }

        try {
            const user = {username, password}
            const response = await fetch('http://localhost:8080/api/login/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user), // if sending data
            });

            if(response.ok){
                const result = await response.json();
                const decodedToken = parseJwt(result.token);
                sessionStorage.setItem('token', result.token);
                console.log("Session Token:", sessionStorage.getItem('token'));
                if(decodedToken.role === 'ADMINISTRATOR'){
                    navigate("/admin");
                }else{
                    navigate("/client");
                }

            }else{
                setPasswordError('Invalid username or password.');
            }

        } catch(error) {
            console.error('Error:', error);
            setPasswordError('Invalid username or password.')
        }
    };

    return <div className={"mainPage"}>
        <div className={"titleContainer"}>
            <div>Login</div>
        </div>
        <br />
        <div className={"fieldContainer"}>
            <div className={"iconRectangle"}>
                <FontAwesomeIcon className={"icon"} icon={ faUser} />
            </div>
            <input
                value={username}
                placeholder="username"
                onChange={ev => setUsername(ev.target.value)}
                className={"inputField"} />
        </div>
        <label className={"errorLabel"}>{usernameError}</label>
        <br />
        <div className={"fieldContainer"}>
            <div className={"iconRectangle"}>
                <FontAwesomeIcon className={"icon"} icon={ faLock} />
            </div>
            <input
                value={password}
                placeholder="password"
                onChange={ev => setPassword(ev.target.value)}
                className={"inputField"} />
        </div>
        <label className={"errorLabel"}>{passwordError}</label>
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value={"Log in"} />
        </div>
    </div>
}

export default Login