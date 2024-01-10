import SockJS from 'sockjs-client'
import {Client} from "@stomp/stompjs";

const connectToWebSocket = (onPrivateMessageReceived) => {

    const sockJsUrl = 'http://localhost:8082/ws';
    const socket = new SockJS(sockJsUrl);
    const token = sessionStorage.getItem('token');

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
        console.log("Connected")
        const name = parseJwt(token).sub;
        console.log(name)

        stompClient.subscribe('/user/'+name+'/private', (message) => {
            console.log("received message", message.body)
            onPrivateMessageReceived(message.body)
        });
        stompClient.send('/app/private-message', {}, "coaie");
    };

    stompClient.onStompError = (frame) => {
        console.error('Stomp error:', frame.headers['message']);
    };
    stompClient.onWebSocketClose = (event) => {
        console.log("Closed.", event);
    }

    stompClient.activate();

    return stompClient;
}

export default connectToWebSocket;