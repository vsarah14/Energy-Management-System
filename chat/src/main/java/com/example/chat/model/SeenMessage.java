package com.example.chat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SeenMessage {
    public String senderName;
    public String receiverName;
    public boolean isSeen;
}
