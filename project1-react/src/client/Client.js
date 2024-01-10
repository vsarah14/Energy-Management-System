import React, {useRef} from 'react'
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import './Client.css';
import ConsumptionChart from "../chart/Chart";
import connectToWebSocket from "../chart/connectToWS";
import Calendar from "../chart/Calendar";
import Error from "../error/Error";

const Client = (props) => {
    const {loggedIn, username} = props
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const token = sessionStorage.getItem('token');
    const [error, setError] = React.useState(false);

    const [message, setMessage] = useState([]);
    const [consumptionData, setConsumptionData] = useState([]); // New state for consumption data
    const [selectedDate, setSelectedDate] = useState({ date: null, deviceId: null });
    const [filteredConsumptionData, setFilteredConsumptionData] = useState([]);

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    const fetchDevices = async () => {

        const decodedToken = parseJwt(token);
        const userId = decodedToken.id;
        try {
            const response = await fetch(`http://localhost:8081/device/read/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            var devices = await response.json();
            setDevices(devices);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    useEffect(() => {
        const stompClient = connectToWebSocket(onMessageReceived);
        fetchDevices();

        return () => {
            stompClient && stompClient.deactivate();
        };

    }, []);

    useEffect(() => {
        console.log(consumptionData);
        console.log('Filtered Consumption Data:', filteredConsumptionData);
    }, [consumptionData])


    let onMessageReceived = (msg) => {
        const data = JSON.parse(msg);
        const deviceId = data.deviceId;

        const newMessage =
            data.maxConsumption > data.totalConsumption
                ? `Device ${deviceId}: Consumption is ok.\n`
                : `Device ${deviceId}: Total hourly consumption ${data.totalConsumption} exceeded the maximum consumption.\n`;

        setMessage((prevMessages) => {
            const updatedMessages = { ...prevMessages };
            updatedMessages[deviceId] = [...(updatedMessages[deviceId] || []), newMessage];
            return updatedMessages;
        });
        console.log(message);
        // Update data for each device
        setConsumptionData((prevData) => {
            const updatedData = { ...prevData };
            updatedData[deviceId] = [...(updatedData[deviceId] || []), data];
            return updatedData;
        });
        console.log(consumptionData);

    };

    useEffect(() => {
        // Filter the consumption data for the selected date if available
        const updatedFilteredConsumptionData = selectedDate
            ? (consumptionData[selectedDate.deviceId] || []).filter((data) => {
                const dataDate = new Date(data.timestamp);
                const selectedDateTime = new Date(selectedDate.date);

                return (
                    dataDate.getDate() === selectedDateTime.getDate() &&
                    dataDate.getMonth() === selectedDateTime.getMonth() &&
                    dataDate.getFullYear() === selectedDateTime.getFullYear()
                );
            })
            : [];
        setFilteredConsumptionData(updatedFilteredConsumptionData);
    }, [selectedDate, consumptionData]);

    const handleDateChange = (date, deviceId) => {
        setSelectedDate({ date, deviceId });
        // Handle the date change as needed
        console.log('Selected Date:', date);
        console.log('Selected Device ID:', deviceId);
    };

    useEffect(() => {
        // Check if the user is an admin and update the token if needed
        const token = sessionStorage.getItem('token'); // Update 'yourTokenKey' with the actual key used to store the token
        const decodedToken = parseJwt(token);

        if (decodedToken.role === 'ADMINISTRATOR') {
            setError(true);
            console.log(error)
        }

    }, [sessionStorage.getItem('token')]);

    const navigateToChat = ()=>{
        navigate("/client/chat")
    }

    useEffect( ()=>{
        const chatButton = document.querySelector(".chatButton");
        if (chatButton) {
            chatButton.addEventListener("click", navigateToChat);
        }
    }, []);

    if (error) {
        return <Error />;
    }

    return (
        <div className={'mainPage'}>
            <div className={'titleContainer'}>
                <div>My devices</div>
            </div>
            <br/>
            <table className={'deviceTable'}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Consumption</th>
                </tr>
                </thead>
                <tbody>
                {devices.map((device) => (
                    <tr key={device.deviceId}>
                        <td>{device.deviceId}</td>
                        <td>{device.name}</td>
                        <td>{device.maxConsumption}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <br/>
            <button type={"button"}  id="chatButton" className={"chatButton"}>
                Chat with administrator
            </button>
            <br/>
            <div className="deviceDiv">
                {devices.map((device) => (
                    <div key={device.deviceId}>
                        <p>Device ID: {device.deviceId}</p>
                        <textarea
                            rows='5'
                            cols='50'
                            value={(message[device.deviceId] || []).join('\n')}
                            readOnly
                        />
                        <br />
                        <Calendar
                            onDateChange={(date) => handleDateChange(date, device.deviceId)}
                            consumptionData={consumptionData[device.deviceId] || []}
                        />
                        {filteredConsumptionData.length > 0 && (
                            <ConsumptionChart consumptionData={filteredConsumptionData} deviceId={device.deviceId}/>
                        )}
                        <hr />
                    </div>
                ))}
            </div>
        </div>);

};
export default Client;