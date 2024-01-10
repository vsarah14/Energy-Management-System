package com.example.project1.device.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_device")
@SequenceGenerator(name = "device_start", sequenceName = "device_start", initialValue = 4)
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "device_start")
    private Integer deviceId;
    private String name;
    private Float maxConsumption;
    private Integer userId;

}
