package com.example.project1.device.controller;

import com.example.project1.device.business.DeviceService;
import com.example.project1.device.configuration.MQConfigDevice;
import com.example.project1.device.model.Device;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@CrossOrigin
@EnableMethodSecurity
public class DeviceController {

    @Autowired
    private final DeviceService deviceService;
    @Autowired
    private RestTemplate restTemplate;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @Autowired
    private RabbitTemplate template;

    //CRUD operations
    //C - create
    @PostMapping("/device/create")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public Device createDevice(@RequestBody Device device) {
        Integer userId = device.getUserId();
        if (userId == null || userId.equals("")) {
            device.setUserId(null);
        } else {
         //   Integer userResponse = restTemplate.getForObject("http://user-microservice:8080/user/readIds/{userId}", Integer.class, userId);
            Integer userResponse = restTemplate.getForObject("http://localhost:8080/user/readIds/{userId}", Integer.class, userId);
            device.setUserId(userResponse);
        }

        Device createdDevice = deviceService.createDevice(device);

        //for RABBITMQ
        if (createdDevice.getUserId() != null) {
            template.convertAndSend(MQConfigDevice.topicExchangeName, MQConfigDevice.routingKey, createdDevice);
        }

        return createdDevice;
    }

    //R - read
    @GetMapping("/device/read")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public List<Device> readDevice() {
        return deviceService.readDevice();
    }

    //U - update
    @PutMapping("/device/update/{deviceId}")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public Device updateDevice(@RequestBody Device device, @PathVariable("deviceId") Integer id) {
        Integer userId = device.getUserId();
        if (userId == null || userId.equals("")) {
            device.setUserId(null);
        } else {
            String userMicroserviceUrl = "http://localhost:8080";
          //  String userMicroserviceUrl = "http://user-microservice:8080";
            Integer userResponse = restTemplate.getForObject(userMicroserviceUrl + "/api/user/readIds/{userId}", Integer.class, userId);
            device.setUserId(userResponse);
        }

        Device updatedDevice = deviceService.updateDevice(device, id);

        //for RABBITMQ
        template.convertAndSend(MQConfigDevice.topicExchangeName, MQConfigDevice.routingKey, updatedDevice);

        return updatedDevice;
    }

    //D - delete
    @DeleteMapping("/device/delete/{deviceId}")
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public String deleteDevice(@PathVariable("deviceId") Integer id) {

        //for RABBITMQ
        Device deletedDevice = deviceService.findById(id);
        if (deletedDevice != null) {
            deletedDevice.setUserId(null);
            template.convertAndSend(MQConfigDevice.topicExchangeName, MQConfigDevice.routingKey, deletedDevice);
        }
        return deviceService.deleteDevice(id);
    }

    //delete the user from a device, when the user is deleted
    @DeleteMapping("/api/device/deleteByUserId/{userId}")
    public void deleteDeviceAndUser(@PathVariable("userId") Integer id) {
        deviceService.deleteDeviceAndUser(id);
    }

    //read devices just for a client
    @GetMapping("/device/read/{userId}")
    @PreAuthorize("hasAuthority('CLIENT')")
    public List<Device> readDeviceForUser(@PathVariable("userId") Integer id) {
        return deviceService.readDeviceForUser(id);
    }

}
