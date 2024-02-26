package com.example.devicesimulator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DeviceSimulatorApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeviceSimulatorApplication.class, args);
    }
}
