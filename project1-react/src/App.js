import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from "./login/Login";
import Home from "./home/Home";
import Admin from "./admin/Admin";
import Client from "./client/Client";
import ChatRoom from "./chat/Chat";

import {useEffect, useState} from 'react';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");

    return (
        <div className={"App"}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}/>
                    <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />}/>
                    <Route path="/admin" element={<Admin setLoggedIn={setLoggedIn} setUsername={setUsername} userId={userId}/>}/>
                    <Route path="/client" element={<Client setLoggedIn={setLoggedIn} setUsername={setUsername} userId={userId} />}/>
                    <Route path="/client/chat" element={<ChatRoom />}/>
                    <Route path="/admin/chat" element={<ChatRoom />}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
