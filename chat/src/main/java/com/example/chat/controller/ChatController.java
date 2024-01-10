package com.example.chat.controller;

import com.example.chat.model.Message;
import com.example.chat.model.SeenMessage;
import com.example.chat.model.TypingMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message){
        return message;
    }

    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message){
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message);
        System.out.println(message.toString());
        return message;
    }

    @MessageMapping("/isTyping")
    public void recMessage(@Payload TypingMessage message){
        System.out.println("Received TypingMessage: " + message.toString());
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/isTyping", message);
    }

    @MessageMapping("/isSeen")
    public void recMessage(@Payload SeenMessage message){
        System.out.println("Received SeenMessage: " + message.toString());
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/isSeen", message);
    }
}
