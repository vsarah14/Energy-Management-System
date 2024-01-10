package com.example.project1.device;

import jakarta.persistence.Entity;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableScheduling
public class Project1DeviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(Project1DeviceApplication.class, args);
	}

}
