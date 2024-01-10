import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
const connectToWebSocket = (onMessageReceived) => {
    // Replace the URL with your WebSocket backend endpoint
    const sockJsUrl = 'http://localhost:9001/stomp-endpoint';
    const socket = new SockJS(sockJsUrl);
    const token= sessionStorage.getItem('token');

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    // Create a Stomp client instance
    const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000, // Optional: Set reconnect delay in milliseconds
        heartbeatIncoming: 4000, // Optional: Set heartbeat incoming interval in milliseconds
        heartbeatOutgoing: 4000, // Optional: Set heartbeat outgoing interval in milliseconds
    });

    // Set up event handlers
    stompClient.onConnect = (frame) => {
        console.log('Connected to WebSocket');
        // Subscribe to a topic upon successful connection
        const userId = parseJwt(token).id;
        console.log(userId)
        stompClient.subscribe('/topic/consumption/'+ userId, (message) => {
            console.log('Received message:', message.body);
            onMessageReceived(message.body);
        });
    };

    stompClient.onStompError = (frame) => {
        console.error('Stomp error:', frame.headers['message']);
    };

    stompClient.onWebSocketClose = (event) => {
        console.log('WebSocket closed:', event);
    };

    // Connect to the WebSocket
    stompClient.activate();

    // Return the Stomp client instance in case you want to interact with it later
    return stompClient;
}

export default connectToWebSocket;