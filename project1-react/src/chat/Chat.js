import React, {useRef, useEffect, useState} from 'react'
import './Chat.css'
import SockJS from "sockjs-client";
import {over} from 'stompjs';

var stompClient = null;
const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [userList, setUserList] = useState(new Map());
    const [tab, setTab] = useState("CHATROOM");
    const token = sessionStorage.getItem('token');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const [isSeen, setIsSeen] = useState(false);
    const [seenUser, setSeenUser] = useState(null);

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    const [userData, setUserData] = useState({
        username: parseJwt(token).sub,
        receivername: '',
        message: '',
        connected: false
    });

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/getAll', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            var users = await response.json();
            const currentUser = parseJwt(token).sub;
            const currentRole = parseJwt(token).role;
            const filteredUsers = users.filter(user => {
                if (currentRole === 'ADMINISTRATOR') {
                    return user.username !== currentUser;
                } else {
                    return user.username !== currentUser && user.role === 'ADMINISTRATOR';
                }
            });
            const initialPrivateChats = new Map(filteredUsers.map(user => [user.username, []]));
            setUserList(initialPrivateChats);
            setPrivateChats(initialPrivateChats);
            console.log('privateChats type and value:', typeof privateChats, privateChats);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const connect = () => {
        let Sock = new SockJS('http://localhost:8082/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/isTyping', onTypingReceived);
        stompClient.subscribe('/user/' + userData.username + '/isSeen', onSeenReceived);
    }

    const onError = (err) => {
        console.log(err);
    }

    const onTypingReceived = (payload) => {
        console.log("Typing has been received");
        console.log()
        const data = JSON.parse(payload.body);
        setTypingUser(data.senderName);
        setTimeout(() => {
            // setTypingUser(null);
            setIsTyping(true);
        });
    }

    const onSeenReceived = (payload) => {
        console.log("Seen has been received");
        const data = JSON.parse(payload.body);
        setSeenUser(data.senderName);
        setTimeout(() => {
            // setTypingUser(null);
            setIsSeen(true);
        });
    }

    const onPrivateMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
            console.log(privateChats)
        }
        setIsTyping(false);
        setTypingUser(null);
        setIsSeen(false);
        setSeenUser(null);
    }

    function handleTypingChange(event) {
        const {value} = event.target;
        setUserData({...userData, "message": value});
        handleIsTyping(event);
        console.log("Typing has been sent");
    }

    function handleSeenChange() {
        handleIsSeen();
        console.log("Seen has been sent");
    }

    function handleIsSeen() {
        if(!isSeen) {
            let seenMessage = {
                receiverName: tab,
                senderName: userData.username,
                isSeen: true,
            };
            stompClient.send("/app/isSeen", {}, JSON.stringify(seenMessage));
        }
    }

    function handleIsTyping(event) {
        if(!isTyping) {
            let typingMessage = {
                receiverName: tab,
                senderName: userData.username,
                isTyping: true,
            };
            console.log(typingMessage)
            stompClient.send("/app/isTyping", {}, JSON.stringify(typingMessage));
        }
        event.preventDefault();
    }

    const handleMessage = (event) => {
        const {value} = event.target;
        setUserData({...userData, "message": value});
    }

    const sendPrivateValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            console.log(stompClient)
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        }
        setUserData({...userData, "message": ""});
    }

    return (
        <div className="chatContainer">
            {userData.connected ?
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            {[...userList.keys()].map((name, index) => (
                                <li onClick={() => {
                                    setTab(name)
                                }} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
                            ))}
                        </ul>
                    </div>
                    {tab !== "CHATROOM" && (<div className="chat-content">
                        {privateChats.get(tab) && (
                            <ul className="chat-messages" onClick={() => handleSeenChange()}>
                                {privateChats.get(tab).filter(x=>!x.isTyping).map((chat, index) => (
                                    <div>
                                        <li className={`message ${chat.senderName === userData.username && "self"}`}
                                            key={index}>
                                            {chat.senderName !== userData.username &&
                                                <div className="avatar">{chat.senderName}</div>}
                                            <div className="message-data">{chat.message}</div>
                                            {chat.senderName === userData.username &&
                                                <div className="avatar self">{chat.senderName}</div>}
                                        </li>
                                    </div>
                                ))}
                                {isTyping && typingUser === tab && <p>Is typing...</p>}
                                {isSeen && seenUser === tab && <p>Seen</p>}
                            </ul>
                        )}

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="Enter the message"
                                   value={userData.message} onChange={handleMessage} onChange={(handleTypingChange)}/>
                            <button type="button" className="send-button" onClick={sendPrivateValue}>Send</button>
                        </div>
                    </div>)}
                </div>
                :
                <div className="register">
                    <button type="button" className={"chatButton"} onClick={connect}>
                        Join chat as {userData.username}!
                    </button>
                </div>}
        </div>
    )
}

export default ChatRoom