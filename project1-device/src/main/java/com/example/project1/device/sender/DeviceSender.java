package com.example.project1.device.sender;

import com.example.project1.device.business.DeviceService;
import com.example.project1.device.configuration.MQConfigDevice;
import com.example.project1.device.model.Device;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DeviceSender {

    @Autowired
    private RabbitTemplate template;
    @Autowired
    private DeviceService deviceService;

    @Scheduled(initialDelay = 5000, fixedDelay=Long.MAX_VALUE)
    public void sendDevicesOnInit() {
        List<Device> devices = deviceService.readDevice();
        System.out.println(devices);
        for (Device d : devices) {
            if (d.getUserId() != null) {
                template.convertAndSend(MQConfigDevice.topicExchangeName, MQConfigDevice.routingKey, d);
            }
        }
        System.out.println("Devices sent.");
    }
}
