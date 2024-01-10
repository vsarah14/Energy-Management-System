import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = (props) => {
    const {loggedIn, username} = props
    const navigate = useNavigate();
    sessionStorage.setItem('token', "");

    const onButtonClick = () => {
        navigate("/login")
    }


    return <div className={"mainPage"}>
        <div className={"titleContainer"}>
            <div>Energy Management System</div>
        </div>
        <div className={"buttonContainer"}>
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value="Register" />
            <input
                className={"inputButton"}
                type="button"
                onClick={onButtonClick}
                value="Log in" />
        </div>
    </div>
}

export default Home