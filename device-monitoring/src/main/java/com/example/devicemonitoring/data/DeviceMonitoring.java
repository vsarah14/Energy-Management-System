package com.example.devicemonitoring.data;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "_device_monitoring")
public class DeviceMonitoring {
    @Id
    @GeneratedValue
    private Integer monitoringId;
    private Integer deviceId;
    private String name;
    private Float maxConsumption;
    private Integer userId;
}
