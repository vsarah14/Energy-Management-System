import React from 'react'
import { useNavigate} from 'react-router-dom';
import {useState, useEffect } from 'react';
import './Admin.css';
import Error from "../error/Error";
import ChatRoom from "../chat/Chat";

const Admin =  ({user}) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [devices, setDevices] = useState([]);
    const [error, setError] = React.useState(false);

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    const createUsers = async () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const token = sessionStorage.getItem('token')

        if (!username || !password) {
            console.error('Username and password are required.');
            return;
        }

        try{
            const response = await fetch('http://localhost:8080/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                console.log('User created successfully.');
                document.getElementById("username").value = '';
                document.getElementById("password").value = '';
            } else {
                console.error('Error creating user:', response.statusText);
            }
        } catch (error){
            console.error('Error creating user:', error);
        }
    };

    const fetchUsers = async () => {
        const token = sessionStorage.getItem('token')

        try{
            const response = await fetch('http://localhost:8080/user/read', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            var users = await response.json();
            setUsers(users);
        }catch(error){
            console.error('Error fetching users:', error);
        }

    };

    const updateUsers = async () => {
        const userId = document.getElementById("userId").value;
        const newUsername = document.getElementById("username").value;
        const newPassword = document.getElementById("password").value;

        const token = sessionStorage.getItem('token')

        if (!newUsername || !newPassword) {
            console.error('Username and password are required.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/user/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: newUsername, password: newPassword }),
            });

            if (response.ok) {
                console.log(`User with ID ${userId} updated successfully.`);

                document.getElementById("userId").value = '';
                document.getElementById("username").value = '';
                document.getElementById("password").value = '';
            } else {
                console.error('Error updating user:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUsers = async () => {
        const userId = document.getElementById("userId").value;
        const token = sessionStorage.getItem('token')

        try {
            const response = await fetch(`http://localhost:8080/user/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                console.log(`User with ID ${userId} deleted successfully.`);
                document.getElementById("userId").value = '';
            } else {
                console.error('Error deleting user:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const createDevices = async () => {
        const name = document.getElementById("name").value;
        const userId = document.getElementById("deviceUserId").value || null || '';
        console.log(userId);
        const token = sessionStorage.getItem('token')
        console.log(token)
        try{
            const response = await fetch('http://localhost:8081/device/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, userId }),
            });
            if (response.ok) {
                console.log('Device created successfully.');

                document.getElementById("name").value = '';
                document.getElementById("deviceUserId").value = '';
            } else {
                console.error('Error creating device:', response.statusText);
            }
        } catch (error){
            console.error('Error creating device:', error);
        }
    };

    const fetchDevices = async () => {
        const token = sessionStorage.getItem('token')

        try{
            const response = await fetch('http://localhost:8081/device/read', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            var devices = await response.json();
            setDevices(devices);
        }catch(error){
            console.error('Error fetching devices:', error);
        }

    };

    const updateDevices = async () => {
        const deviceId = document.getElementById("deviceId").value;
        const newName = document.getElementById("name").value;
        const newUser = document.getElementById("deviceUserId").value;
        const token = sessionStorage.getItem('token')

        try {
            const response = await fetch(`http://localhost:8081/device/update/${deviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName, userId: newUser}),
            });

            if (response.ok) {
                console.log(`Device with ID ${deviceId} updated successfully.`);

                document.getElementById("deviceId").value = '';
                document.getElementById("name").value = '';
                document.getElementById("deviceUserId").value = '';
            } else {
                console.error('Error updating device:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating device:', error);
        }
    };

    const deleteDevices = async () => {
        const deviceId = document.getElementById("deviceId").value;
        const token = sessionStorage.getItem('token')

        try {
            const response = await fetch(`http://localhost:8081/device/delete/${deviceId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                console.log(`Device with ID ${deviceId} deleted successfully.`);
                document.getElementById("deviceId").value = '';
            } else {
                console.error('Error deleting device:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting device:', error);
        }
    };

    const navigateToChat = ()=>{
        navigate("/admin/chat")
    }

    useEffect(()=> {
        fetchUsers();
        fetchDevices();
        const createUserButton = document.querySelector(".createUserButton");
        const updateUserButton = document.querySelector(".updateUserButton");
        const deleteUserButton = document.querySelector(".deleteUserButton");
        const createDeviceButton = document.querySelector(".createDeviceButton");
        const updateDeviceButton = document.querySelector(".updateDeviceButton");
        const deleteDeviceButton = document.querySelector(".deleteDeviceButton");
        const chatButton = document.querySelector(".chatButton");

        if (createUserButton) {
            createUserButton.addEventListener("click", createUsers);
        }

        if (updateUserButton) {
            updateUserButton.addEventListener("click", updateUsers);
        }

        if (deleteUserButton) {
            deleteUserButton.addEventListener("click", deleteUsers);
        }

        if (createDeviceButton) {
            createDeviceButton.addEventListener("click", createDevices);
        }

        if (updateDeviceButton) {
            updateDeviceButton.addEventListener("click", updateDevices);
        }

        if (deleteDeviceButton) {
            deleteDeviceButton.addEventListener("click", deleteDevices);
        }

        if (chatButton) {
            chatButton.addEventListener("click", navigateToChat);
        }
    }, []);

    useEffect(() => {
        // Check if the user is an admin and update the token if needed
        const token = sessionStorage.getItem('token'); // Update 'yourTokenKey' with the actual key used to store the token
        const decodedToken = parseJwt(token);

        if (decodedToken.role === 'CLIENT') {
            setError(true);
            console.log(error)
        }

    }, [sessionStorage.getItem('token')]);

    if (error) {
        return <Error />;
    }

    return <div className={"mainContainer"}>
        <div className={"titleContainer"}>
            <div>Manage the clients</div>
        </div>
        <br />
        <table className={"dataTable"}>
            <thead>
            <tr>
                <th>ID</th>
                <th>Username</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <br />
        <div className={"dataContainer"}>
            <input
                type={"text"}
                id={"userId"}
                placeholder="id"
                className={"inputField"}
                style={{ marginRight: "5px" }}
            />
            <input
                type={"text"}
                id={"username"}
                placeholder="username"
                className={"inputField"}
                style={{ marginRight: "5px" }}
            />
            <input
                type={"text"}
                id={"password"}
                placeholder="password"
                className={"inputField"} />
        </div>
        <br />
        <div className={"buttonContainer"}>
            <button id="crudButton" className={"createUserButton"} >Create</button>
            <button id="crudButton" className={"readUserButton"} onClick={fetchUsers}>Read</button>
            <button id="crudButton" className={"updateUserButton"} >Update</button>
            <button id="crudButton" className={"deleteUserButton"} >Delete</button>
        </div>
        <div className={"chatDiv"}>
            <button id="chatButton" className={"chatButton"} >Chat with clients</button>
        </div>
        <hr className={"line"} />
        <div className={"titleContainer"}>
            <div>Manage the devices</div>
        </div>
        <br />
        <table className={"dataTable"}>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>User ID</th>
            </tr>
            </thead>
            <tbody>
            {devices.map((device) => (
                <tr key={device.deviceId}>
                    <td>{device.deviceId}</td>
                    <td>{device.name}</td>
                    <td>{device.userId}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <br />
        <div className={"dataContainer"}>
            <input
                type={"text"}
                id={"deviceId"}
                placeholder="id"
                className={"inputField"}
                style={{ marginRight: "5px" }}
            />
            <input
                type={"text"}
                id={"name"}
                placeholder="device name"
                className={"inputField"}
                style={{ marginRight: "5px" }}
            />
            <input
                type={"text"}
                id={"deviceUserId"}
                placeholder="user id"
                className={"inputField"} />
        </div>
        <br />
        <div className={"buttonContainer"}>
            <button id="crudButton" className={"createDeviceButton"} >Create</button>
            <button id="crudButton" className={"readDeviceButton"} onClick={fetchDevices}>Read</button>
            <button id="crudButton" className={"updateDeviceButton"} >Update</button>
            <button id="crudButton" className={"deleteDeviceButton"} >Delete</button>
        </div>

    </div>

};
export default Admin;