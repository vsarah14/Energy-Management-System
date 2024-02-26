package com.example.devicesimulator.sender;

import com.example.devicesimulator.configuration.MQConfigSimulator;
import com.example.devicesimulator.data.Measurement;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@Component
public class MessageSender {
    @Autowired
    private RabbitTemplate template;
    private final List<Float> values = readData();
    private int currentIndex = 0;

    @Value("${device.id}")
    private int deviceId;
  // private final int deviceId;

   // @Autowired
  //  public MessageSender(RabbitTemplate template, @Value("${device.id}") int deviceId) {
  //      this.template = template;
  //      this.deviceId = deviceId;
  //  }

    @Scheduled(fixedRate = 2000)
    public void sendMeasurement() {

        Measurement measurement = new Measurement();
        measurement.setDeviceId(deviceId);

        if(currentIndex < values.toArray().length){
            Float data = values.get(currentIndex);
            System.out.println(data);

            measurement.setMeasurementValue(data);
            measurement.setTimestamp(System.currentTimeMillis());
            System.out.println(measurement);
            template.convertAndSend(MQConfigSimulator.topicExchangeName, MQConfigSimulator.routingKey, measurement);
            currentIndex++;
        } else {
            currentIndex = 0;
        }
    }

    public List<Float> readData() {
        List<Float> list = new ArrayList<>();

       // try (Scanner scanner = new Scanner(new File("sensor.csv"))) {
        try (Scanner scanner = new Scanner(new File("/app/sensor.csv"))) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                list.add(Float.parseFloat(line));
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return list;
    }

}
