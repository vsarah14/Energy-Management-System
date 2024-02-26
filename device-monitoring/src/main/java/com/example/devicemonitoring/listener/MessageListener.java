package com.example.devicemonitoring.listener;

import com.example.devicemonitoring.configuration.MQConfigDevice;
import com.example.devicemonitoring.configuration.MQConfigSimulator;
import com.example.devicemonitoring.data.Consumption;
import com.example.devicemonitoring.data.DeviceMonitoring;
import com.example.devicemonitoring.data.Measurement;
import com.example.devicemonitoring.repository.ConsumptionRepository;
import com.example.devicemonitoring.repository.DeviceRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
@Component
@Service
public class MessageListener {
    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private ConsumptionRepository consumptionRepository;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    private int measurementCount = 0;
    private float hourlyConsumption = 0;
    private long timestamp = System.currentTimeMillis();

    @RabbitListener(queues = MQConfigSimulator.queueName, containerFactory = "simulatorListenerFactory")
    public void listenerMeasurement(Measurement measurement){
        System.out.println(measurement);
        if(measurementCount < 6){
            measurementCount++;
            hourlyConsumption += measurement.getMeasurementValue();
        }
        if(measurementCount == 6){
            Consumption consumption = new Consumption();
            consumption.setTimestamp(timestamp);
            // Convert timestamp to LocalDateTime
            LocalDateTime dateTime = Instant.ofEpochMilli(timestamp)
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            // Format LocalDateTime as a string
            String formattedDateTime = dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            System.out.println("Formatted Date and Time: " + formattedDateTime);

            timestamp += 60*60*1000;
            DeviceMonitoring device = deviceRepository.findByDeviceId(measurement.getDeviceId());
            consumption.setDeviceId(measurement.getDeviceId());
            consumption.setTotalConsumption(hourlyConsumption);
            consumption.setMaxConsumption(device.getMaxConsumption());
            consumptionRepository.save(consumption);

            String userId = device.getUserId().toString();
          //  if(consumption.getTotalConsumption() > device.getMaxConsumption()) {
          //      simpMessagingTemplate.convertAndSend("/topic/consumption/" + userId, "The total hourly consumption " + consumption.getTotalConsumption().toString() + " exceeded the max consumption of the device.");
          //  }else{
          //      simpMessagingTemplate.convertAndSend("/topic/consumption/" + userId, "Consumption is ok.");
          //  }
            simpMessagingTemplate.convertAndSend("/topic/consumption/" + userId, consumption);
            resetValues();
        }
    }

    public void resetValues(){
        measurementCount = 0;
        hourlyConsumption = 0;
    }

    @RabbitListener(queues = MQConfigDevice.queueName, containerFactory = "deviceListenerFactory")
    public void listenerDevices(DeviceMonitoring device){
        System.out.println(device);
        DeviceMonitoring existingDevice = deviceRepository.findByDeviceId(device.getDeviceId());
        if(device.getUserId() != null) {
            if (existingDevice == null) {
                deviceRepository.save(device);
            } else {
                DeviceMonitoring updatedDevice = new DeviceMonitoring();
                updatedDevice.setDeviceId(device.getDeviceId());
                updatedDevice.setName(device.getName());
                updatedDevice.setUserId(device.getUserId());
                updatedDevice.setMaxConsumption(device.getMaxConsumption());
                deviceRepository.delete(existingDevice);
                deviceRepository.save(updatedDevice);
            }
        }else{
            if (existingDevice != null) {
                deviceRepository.delete(existingDevice);
            }
            else{
                return;
            }
        }
    }
}

